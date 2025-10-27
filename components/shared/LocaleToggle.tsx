"use client";

import { useStore } from "@/lib/store";
import { getCopy } from "@/lib/i18n";
import { logEvent } from "@/lib/audit";
import { isBrowser } from "@/lib/is-browser";

export const LocaleToggle = () => {
  const locale = useStore((state) => state.locale);
  const setLocale = useStore((state) => state.setLocale);
  const copy = getCopy(locale);

  const handleToggle = () => {
    if (!isBrowser) return;
    const next = locale === "en" ? "es" : "en";
    setLocale(next);
    logEvent("locale", { locale: next }, window.location.pathname);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-brand hover:text-brand"
      aria-label="Toggle language"
    >
      {copy.localeToggle}
    </button>
  );
};
