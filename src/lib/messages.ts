/**
 * Typed access to list-shaped entries in messages/*.json.
 *
 * next-intl's `raw` returns the underlying JSON, which is what we want for arrays
 * of cards and steps. Strings carrying ICU placeholders must NOT come through
 * here — they need `t(key, values)` so the placeholder is filled.
 */

export type NamedItem = { name: string; body?: string; items?: string[] };
export type QA = { q: string; a: string };

type RawReader = { raw: (key: string) => unknown };

export function namedItems(t: RawReader, key: string): NamedItem[] {
  const value = t.raw(key);
  return Array.isArray(value) ? (value as NamedItem[]) : [];
}

export function lines(t: RawReader, key: string): string[] {
  const value = t.raw(key);
  return Array.isArray(value) ? (value as string[]) : [];
}

/** Number of entries in a list, for callers that must index with `t()`. */
export function count(t: RawReader, key: string): number {
  const value = t.raw(key);
  return Array.isArray(value) ? value.length : 0;
}
