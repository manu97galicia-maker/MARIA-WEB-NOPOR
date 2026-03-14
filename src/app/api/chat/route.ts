import { NextRequest, NextResponse } from "next/server";
import {
  CHARACTER_PERSONA,
  MULTI_MSG_INSTRUCTION_ES,
  MULTI_MSG_INSTRUCTION_EN,
  ROUTER_SYSTEM_PROMPT,
  ROUTER_SCHEMA,
  GREETING_SCHEMA,
  STYLE_INSTRUCTIONS,
  CHARACTER_NAME,
} from "@/lib/prompts";
import { normalizeOutgoingText, t } from "@/lib/textUtils";
import { getPacksMenu, STRIPE_LINKS } from "@/lib/payments";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const FALLBACK_MODELS = ["gpt-4.1-mini", "gpt-4o-mini"];

// ── Types ──

interface RouterDecision {
  action: string;
  pack_choice: string | null;
  delay_seconds: number;
  typing_seconds: number;
  response_style: string;
  send_voice: boolean;
  include_payment_links: boolean;
  engagement_level: string;
  reasoning: string;
}

interface ChatRequest {
  message: string;
  sessionId: string;
  history: { role: string; content: string }[];
  lang: string;
  messageCount: number;
  paymentVerified: boolean;
  isEroticMode: boolean;
  isBlocked: boolean;
  paymentNudgeCount: number;
  voiceCount: number;
  isFirstMessage: boolean;
  senderName: string;
}

// ── OpenAI call helper ──

async function callOpenAI(
  messages: { role: string; content: string }[],
  model: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    responseFormat?: unknown;
  } = {}
): Promise<string | null> {
  if (!OPENAI_API_KEY) return null;

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: options.temperature ?? 0.95,
    max_tokens: options.maxTokens ?? 250,
    top_p: 0.95,
    frequency_penalty: 0.7,
    presence_penalty: 0.6,
  };
  if (options.responseFormat) {
    body.response_format = options.responseFormat;
  }

  try {
    const resp = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (resp.ok) {
      const data = await resp.json();
      return data.choices?.[0]?.message?.content?.trim() || null;
    }
    console.error("OpenAI error:", resp.status, await resp.text().catch(() => ""));
  } catch (e) {
    console.error("OpenAI exception:", e);
  }
  return null;
}

// ── First greeting ──

async function generateFirstGreeting(
  userText: string,
  senderName: string
): Promise<{ greeting: string; lang: string }> {
  const prompt = `User's first message: "${userText}"
User's display name: "${senderName}"

Tasks:
1. Detect what language the user's message is written in.
2. Generate a SHORT flirty greeting (max 10-12 words) in the SAME language.
You are ${CHARACTER_NAME}, a charming 22-year-old from Madrid. Be confident, flirty, a bit playful.
Examples: 'vaya vaya, que tenemos aqui', 'hola guapo, cuentame algo'.
If the name is real, use it: 'hola [name], que tal estas'. Never be aggressive.`;

  try {
    const content = await callOpenAI(
      [
        { role: "system", content: "Follow instructions exactly." },
        { role: "user", content: prompt },
      ],
      "gpt-4.1-mini",
      { temperature: 0.9, maxTokens: 120, responseFormat: GREETING_SCHEMA }
    );
    if (content) {
      const parsed = JSON.parse(content);
      return {
        greeting: parsed.greeting?.trim() || `hola ${senderName} 😘`,
        lang: (parsed.lang || "es").toLowerCase().slice(0, 2),
      };
    }
  } catch (e) {
    console.error("Greeting error:", e);
  }

  // Fallback
  const isEn = /\b(hi|hello|hey|english)\b/i.test(userText);
  return {
    greeting: isEn
      ? `Hey ${senderName || "there"}, nice to meet you 😘`
      : `Hola ${senderName || "guapo"}, que tal 😘`,
    lang: isEn ? "en" : "es",
  };
}

// ── Router: classify user intent ──

async function classifyMessage(
  req: ChatRequest
): Promise<RouterDecision> {
  const recent = req.history
    .slice(-6)
    .map((m) => `${m.role === "assistant" ? CHARACTER_NAME : "User"}: ${m.content.slice(0, 120)}`)
    .join("\n  ");

  const userPrompt = `Classify this message and decide the action.

## Current State:
- Language: ${req.lang}
- Messages sent: ${req.messageCount}
- Payment verified: ${req.paymentVerified}
- Erotic mode: ${req.isEroticMode}
- Chat blocked: ${req.isBlocked}
- Voice notes sent: ${req.voiceCount} / 4 max
- Payment nudge count: ${req.paymentNudgeCount}

## Recent conversation:
  ${recent}

## New user message:
"${req.message}"

Return the routing decision as JSON.`;

  try {
    const content = await callOpenAI(
      [
        { role: "system", content: ROUTER_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      "gpt-4.1-mini",
      { temperature: 0.3, maxTokens: 300, responseFormat: ROUTER_SCHEMA }
    );
    if (content) {
      const parsed = JSON.parse(content);
      // Enforce limits
      if (parsed.pack_choice && !["basico", "vip"].includes(parsed.pack_choice)) {
        parsed.pack_choice = null;
      }
      if (req.paymentVerified || req.isEroticMode) {
        parsed.include_payment_links = false;
        if (["soft_reminder", "block_freeloader", "reply_vague"].includes(parsed.action)) {
          parsed.action = "reply_normal";
          parsed.response_style = "flirty";
          parsed.engagement_level = "high";
        }
      }
      if (req.paymentNudgeCount >= 12 && !req.paymentVerified && !req.isEroticMode) {
        parsed.action = "block_freeloader";
      }
      if (req.voiceCount >= 4) {
        parsed.send_voice = false;
      }
      return parsed as RouterDecision;
    }
  } catch (e) {
    console.error("Router error:", e);
  }

  // Fallback
  return {
    action: "reply_normal",
    pack_choice: null,
    delay_seconds: 3,
    typing_seconds: 5,
    response_style: "warm",
    send_voice: false,
    include_payment_links: false,
    engagement_level: "medium",
    reasoning: "fallback",
  };
}

// ── Generate AI response ──

async function generateResponse(
  history: { role: string; content: string }[],
  userMessage: string,
  lang: string,
  responseStyle: string,
  paymentNudgeCount: number,
  isEroticMode: boolean
): Promise<string[]> {
  const multiMsg =
    lang === "en" ? MULTI_MSG_INSTRUCTION_EN : MULTI_MSG_INSTRUCTION_ES;
  let persona = CHARACTER_PERSONA + multiMsg;

  const styleNote = STYLE_INSTRUCTIONS[responseStyle] || "";
  if (styleNote) persona += `\n\nSTYLE NOTE: ${styleNote}`;

  if (paymentNudgeCount >= 5 && paymentNudgeCount < 23 && !isEroticMode) {
    persona += t(
      lang,
      " El cliente lleva varios mensajes. Responde breve y si viene a cuento recuerda tus servicios.",
      " The client has been chatting a while. Reply briefly and if relevant mention your services."
    );
  }

  const apiMessages = [
    { role: "system", content: persona },
    ...history.slice(-30),
    { role: "user", content: userMessage },
  ];

  const models = [OPENAI_MODEL, ...FALLBACK_MODELS.filter((m) => m !== OPENAI_MODEL)];
  for (const model of models) {
    const content = await callOpenAI(apiMessages, model);
    if (content) {
      const parts = content
        .split("[MSG]")
        .map((p: string) => p.trim())
        .filter(Boolean);
      return parts.length
        ? parts.flatMap((p: string) => normalizeOutgoingText(p))
        : normalizeOutgoingText(content);
    }
  }
  return lang === "en"
    ? ["hey babe 😘", "tell me more"]
    : ["hola guapo 😘", "cuentame mas"];
}

// ── Main POST handler ──

export async function POST(request: NextRequest) {
  try {
    const req: ChatRequest = await request.json();

    // First message: generate greeting
    if (req.isFirstMessage) {
      const { greeting, lang } = await generateFirstGreeting(
        req.message,
        req.senderName
      );
      return NextResponse.json({
        messages: [greeting],
        lang,
        action: "greeting",
        sendVoice: true, // always voice on first message
        typingSeconds: 3,
        paymentLinks: null,
      });
    }

    // Classify intent with router
    const decision = await classifyMessage(req);

    let messages: string[] = [];
    let paymentLinks: string | null = null;

    switch (decision.action) {
      case "send_prices":
      case "send_payment_links":
        messages = [
          t(
            req.lang,
            "vale te cuento lo que tengo 😏",
            "ok let me tell you what I have 😏"
          ),
        ];
        paymentLinks = getPacksMenu(req.lang);
        break;

      case "handle_verification":
        messages = [
          t(
            req.lang,
            "si amor, soy real 😂 verificada y todo. te interesa algo o solo miras? 💕",
            "yes babe, I'm real 😂 verified and everything. interested in anything or just looking? 💕"
          ),
        ];
        break;

      case "block_freeloader":
        messages = [
          t(
            req.lang,
            "lo siento guapo, llevamos mucho rato y no puedo seguir asi 💔 elige algo y seguimos",
            "I'm sorry babe, we've been chatting for a while and I can't continue like this 💔 pick something and we continue"
          ),
        ];
        paymentLinks = getPacksMenu(req.lang);
        break;

      case "soft_reminder":
      case "reply_normal":
      case "reply_vague":
      default:
        messages = await generateResponse(
          req.history,
          req.message,
          req.lang,
          decision.response_style,
          req.paymentNudgeCount,
          req.isEroticMode
        );
        if (decision.include_payment_links) {
          paymentLinks = getPacksMenu(req.lang);
        }
        break;
    }

    // Increment nudge for non-paying users on normal replies
    let incrementNudge = false;
    if (
      !req.paymentVerified &&
      !req.isEroticMode &&
      ["reply_normal", "reply_vague", "soft_reminder"].includes(decision.action)
    ) {
      incrementNudge = true;
    }

    return NextResponse.json({
      messages,
      action: decision.action,
      sendVoice: decision.send_voice,
      typingSeconds: decision.typing_seconds,
      responseStyle: decision.response_style,
      engagementLevel: decision.engagement_level,
      paymentLinks,
      incrementNudge,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
