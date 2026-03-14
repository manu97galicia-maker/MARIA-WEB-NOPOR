import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "";
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "";
const ELEVENLABS_VOICE_ID_EN = process.env.ELEVENLABS_VOICE_ID_EN || "";
const ELEVENLABS_MODEL = process.env.ELEVENLABS_MODEL || "eleven_flash_v2_5";

function cleanEmojis(text: string): string {
  return text
    .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
    .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
    .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
    .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
    .replace(/[\u{200D}]/gu, "")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const { text, lang } = await request.json();

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({ error: "Voice not configured" }, { status: 500 });
    }

    const clean = cleanEmojis(text);
    if (!clean || clean.length < 3) {
      return NextResponse.json({ error: "Text too short" }, { status: 400 });
    }

    const voiceId = lang === "en" ? ELEVENLABS_VOICE_ID_EN : ELEVENLABS_VOICE_ID;
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: clean,
        model_id: ELEVENLABS_MODEL,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => "");
      console.error("ElevenLabs error:", resp.status, errText.slice(0, 200));
      return NextResponse.json({ error: "Voice generation failed" }, { status: 502 });
    }

    const audioBuffer = await resp.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Voice API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
