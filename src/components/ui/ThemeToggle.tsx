"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "e2w-theme";

/**
 * The <html data-theme> attribute is the single source of truth. ThemeScript sets
 * it before first paint, so there is never a flash and never a hydration mismatch
 * to paper over: the server renders "system", and useSyncExternalStore reconciles
 * to whatever the document actually carries.
 */
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot(): Theme {
  const v = document.documentElement.getAttribute("data-theme");
  return v === "light" || v === "dark" ? v : "system";
}

/** The server cannot know the visitor's stored choice, so it assumes the system one. */
function getServerSnapshot(): Theme {
  return "system";
}

function setTheme(next: Theme) {
  const root = document.documentElement;
  if (next === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", next);

  try {
    if (next === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Storage blocked (private mode, blocked cookies): the choice still applies
    // to this page view, it simply is not remembered.
  }

  for (const fn of listeners) fn();
}

/** Cycles system → light → dark. System is the default and a real option. */
export function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";

  return (
    <button
      type="button"
      className="themetoggle"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      data-theme-state={theme}
    >
      <span aria-hidden="true" className="themetoggle__glyph" />
    </button>
  );
}
