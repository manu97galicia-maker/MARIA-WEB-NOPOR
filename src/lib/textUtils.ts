// Text processing utilities — ported from the Telegram bot

export function detectEnglish(text: string): boolean {
  return /\b(english|hi|hello|hey|how are you|what'?s up|sup)\b/i.test(text);
}

export function stylizeChatText(text: string): string {
  if (!text) return text;
  let out = text.replace(/¿/g, "");

  const rules: [RegExp, string, number][] = [
    [/\bque\b/g, "q", 0.35],
    [/\btambién\b/g, "tb", 0.30],
    [/\btambien\b/g, "tb", 0.30],
    [/\bmuy\b/g, "mu", 0.15],
    [/\bpor qué\b/g, "xq", 0.25],
    [/\bporque\b/g, "xq", 0.25],
    [/\bbueno\b/g, "bno", 0.30],
    [/\bpara\b/g, "pa", 0.20],
    [/\bverdad\b/g, "verdá", 0.15],
    [/\bbuenas\b/g, "bnas", 0.20],
    [/\ba ver\b/g, "aver", 0.35],
    [/\bguapo\b/g, "wpo", 0.15],
  ];

  // Randomly lowercase first letter (real texting)
  if (Math.random() < 0.3 && out.length > 1 && out[0] === out[0].toUpperCase()) {
    out = out[0].toLowerCase() + out.slice(1);
  }

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
