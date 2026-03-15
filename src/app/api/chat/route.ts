import { NextRequest, NextResponse } from "next/server";
import {
  CHARACTER_NAME,
} from "@/lib/prompts";
import { getPacksMenu } from "@/lib/payments";

const TELEGRAM_LINK = "https://t.me/mariahot66";

// Simple keyword detection — no LLM needed for this funnel
function detectLang(text: string): string {
  return /\b(hi|hello|hey|english|what|how|price|cost)\b/i.test(text) ? "en" : "es";
}

function isPriceQuestion(text: string): boolean {
  return /\b(precio|precios|cuanto|cuesta|pack|packs|foto|fotos|video|chat|servicio|servicios|planes|plan|comprar|pagar|price|prices|cost|how much|buy|pay|plans|photos|content)\b/i.test(text);
}

function t(lang: string, es: string, en: string): string {
  return lang === "en" ? en : es;
}

export async function POST(request: NextRequest) {
  try {
    const { message, lang: clientLang, isFirstMessage } = await request.json();
    const lang = clientLang || detectLang(message);

    // First message: greeting + redirect to Telegram
    if (isFirstMessage) {
      return NextResponse.json({
        messages: [
          t(lang,
            `eyyy q tal? 😘 soy ${CHARACTER_NAME}`,
            `heyy how are you? 😘 I'm ${CHARACTER_NAME}`
          ),
          t(lang,
            `pa hablar conmigo de verdad escribeme por Telegram, ahi te contesto con mi voz y todo 💋`,
            `to really talk to me text me on Telegram, I reply with my real voice and everything 💋`
          ),
        ],
        lang,
        telegramLink: TELEGRAM_LINK,
        showPrices: false,
      });
    }

    // Price questions: show prices + Telegram
    if (isPriceQuestion(message)) {
      return NextResponse.json({
        messages: [
          t(lang,
            "bno mira esto es lo q tengo 😏",
            "ok so this is what I got 😏"
          ),
        ],
        lang,
        prices: getPacksMenu(lang),
        telegramLink: TELEGRAM_LINK,
        showPrices: true,
      });
    }

    // Everything else: redirect to Telegram
    return NextResponse.json({
      messages: [
        t(lang,
          `jaja escribeme por Telegram q ahi hablamos mejor 😘`,
          `haha text me on Telegram we can talk better there 😘`
        ),
      ],
      lang,
      telegramLink: TELEGRAM_LINK,
      showPrices: false,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
