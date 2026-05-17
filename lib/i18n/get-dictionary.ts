import { ar } from "./dictionaries/ar";
import { en } from "./dictionaries/en";
import type { Locale } from "./config";
import { getContent } from "@/lib/content/service";

const fallbackDictionaries = { ar, en } as const;

/**
 * Fetches the locale dictionary from MongoDB (with static fallback).
 * Always async because it talks to the database.
 */
export async function getDictionary(locale: Locale) {
  return getContent(locale);
}

/**
 * Synchronous fallback that always returns the bundled dictionary.
 * Kept for places where async is impossible (none currently).
 */
export function getStaticDictionary(locale: Locale) {
  return fallbackDictionaries[locale];
}

export type { Dictionary } from "./dictionaries/ar";
