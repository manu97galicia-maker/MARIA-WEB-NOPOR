// Text processing utilities — ported from the Telegram bot

export function detectEnglish(text: string): boolean {
  return /\b(english|hi|hello|hey|how are you|what'?s up|sup)\b/i.test(text);
}

export function stylizeChatText(text: string): string {
  if (!text) return text;
  let out = text.replace(/¿/g, "");

  const rules: [RegExp, string, number][] = [
    [/\bque\b/g, "q", 0.3],
    [/\bcomo\b/g, "com", 0.25],
    [/\btambién\b/g, "ta,bién", 0.18],
    [/\bmuy\b/g, "mui", 0.12],
    [/\bpor qué\b/g, "xq", 0.2],
    [/\bporque\b/g, "xq", 0.18],
  ];

  for (const [pattern, replacement, prob] of rules) {
    if (Math.random() < prob) {
      out = out.replace(pattern, replacement);
    }
  }
  return out;
}

export function splitMessageChunks(text: string, maxLen = 150): string[] {
  if (!text) return [];
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const chunks: string[] = [];

  for (const line of lines) {
    if (line.length <= maxLen) {
      chunks.push(line);
      continue;
    }
    const words = line.split(" ");
    let current = "";
    for (const w of words) {
      const candidate = current ? `${current} ${w}` : w;
      if (candidate.length <= maxLen) {
        current = candidate;
      } else {
        if (current) chunks.push(current);
        current = w;
      }
    }
    if (current) chunks.push(current);
  }
  return chunks;
}

export function normalizeOutgoingText(text: string): string[] {
  return splitMessageChunks(stylizeChatText(text), 150);
}

export function t(lang: string, es: string, en: string): string {
  return lang === "en" ? en : es;
}
