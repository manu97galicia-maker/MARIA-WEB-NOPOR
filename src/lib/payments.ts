// Payment links and pack definitions

export const STRIPE_LINKS = {
  chat_semana: process.env.STRIPE_LINK_CHAT_SEMANA || "",
  basico: process.env.STRIPE_LINK_BASICO || "",
  vip: process.env.STRIPE_LINK_VIP || "",
  chat: process.env.STRIPE_LINK_CHAT || "",
};

export interface Pack {
  name: string;
  description: string;
  priceEur: number;
  emoji: string;
  stripeLink: string;
}

export const PACKS: Record<string, Pack> = {
  basico: {
    name: "Pack Basico",
    description: "5 fotos",
    priceEur: 10,
    emoji: "📸",
    stripeLink: STRIPE_LINKS.basico,
  },
  vip: {
    name: "Pack Premium",
    description: "10 fotos + video",
    priceEur: 20,
    emoji: "👑",
    stripeLink: STRIPE_LINKS.vip,
  },
};

export function getPacksMenu(lang: string): string {
  if (lang === "en") {
    return (
      `🔥 Chat with me for 1 week - 100€ 😈\n${STRIPE_LINKS.chat_semana}\n\n` +
      `👑 Pack premium 10 photos 20€ + video\n${STRIPE_LINKS.vip}\n\n` +
      `📸 Pack basic 5 photos 10€\n${STRIPE_LINKS.basico}\n\n` +
      `💬 Chat 1 day\n${STRIPE_LINKS.chat}`
    );
  }
  return (
    `🔥 Chatea conmigo 1 semana - 100€ 😈\n${STRIPE_LINKS.chat_semana}\n\n` +
    `👑 Pack premium 10 fotos 20€ + video\n${STRIPE_LINKS.vip}\n\n` +
    `📸 Pack basico 5 fotos 10€\n${STRIPE_LINKS.basico}\n\n` +
    `💬 Chat 1 dia\n${STRIPE_LINKS.chat}`
  );
}
