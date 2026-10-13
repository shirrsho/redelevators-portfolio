"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EVENTS, track } from "./analytics";
import { DEFAULT_CURRENCY, FX, formatMoney, isCurrency, type Currency } from "./pricing";

// Currency choice (USD default, AED, EUR), remembered per visitor in localStorage `re-cur`.
// Mounted once in src/app/layout.tsx. Mockup: site.js → CUR, setCur, curListeners.
//
// The server always renders USD; a stored or ?cur= choice is applied right after mount, so
// prices are never read from storage during render (no hydration mismatch).

const KEY = "re-cur";

type CurrencyContext = {
  cur: Currency;
  setCur: (c: Currency) => void;
  /** Format an amount already in `cur`: "$1,234", "AED 1,234", "€1,234". */
  money: (n: number) => string;
  /** Display factor for values entered in dollars (FX[cur]). */
  fx: number;
};

const Ctx = createContext<CurrencyContext | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [cur, setState] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    let c: string | null = new URLSearchParams(location.search).get("cur");
    try {
      c = c || localStorage.getItem(KEY);
    } catch {}
    // Applying a stored preference after mount is the intended one-off sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isCurrency(c) && c !== DEFAULT_CURRENCY) setState(c);
  }, []);

  const setCur = useCallback((c: Currency) => {
    setState(c);
    try {
      localStorage.setItem(KEY, c);
    } catch {}
    track(EVENTS.currencyChange, { currency: c });
  }, []);

  const value = useMemo<CurrencyContext>(
    () => ({ cur, setCur, money: (n) => formatMoney(n, cur), fx: FX[cur] }),
    [cur, setCur],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency(): CurrencyContext {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCurrency() needs <CurrencyProvider> (src/app/layout.tsx)");
  return v;
}
