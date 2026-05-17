import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE_CONFIG = {
  name: "Codex",
  url: "https://codex-tech.com",
  ogImage: "https://codex-tech.com/og.png",
  email: "hello@codex-tech.com",
  phone: "+20 100 000 0000",
  whatsapp: "201000000000",
  location: {
    ar: "القاهرة، مصر",
    en: "Cairo, Egypt",
  },
  social: {
    twitter: "https://twitter.com/codex_tech",
    linkedin: "https://linkedin.com/company/codex-tech",
    instagram: "https://instagram.com/codex.tech",
    facebook: "https://facebook.com/codex.tech",
  },
} as const;
