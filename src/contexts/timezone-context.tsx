"use client";

import { createContext, useContext } from "react";

/**
 * React context providing the system-configured timezone to client components.
 *
 * Server components can call `getResolvedSystemTimeZone()` directly, but
 * client components need the timezone value passed from a server component
 * via this context. This ensures all client-side datetime formatting uses
 * the same authoritative timezone (e.g., "Asia/Seoul") rather than the
 * browser's local timezone.
 *
 * Usage:
 * 1. In a server layout, wrap children with `<SystemTimezoneProvider timeZone={timeZone}>`.
 * 2. In client components, call `const timeZone = useSystemTimezone()`.
 * 3. Pass `timeZone` to `formatDateTimeInTimeZone()`, `formatDateInTimeZone()`,
 *    or `formatRelativeTimeFromNow()` from `@/lib/datetime`.
 */

const SystemTimezoneContext = createContext<string>("Asia/Seoul");

export function SystemTimezoneProvider({
  timeZone,
  children,
}: {
  timeZone: string;
  children: React.ReactNode;
}) {
  return (
    <SystemTimezoneContext.Provider value={timeZone}>
      {children}
    </SystemTimezoneContext.Provider>
  );
}

/**
 * Get the system-configured timezone in a client component.
 *
 * Falls back to "Asia/Seoul" if the provider is not present (should not
 * happen in normal usage — all layouts should include the provider).
 */
export function useSystemTimezone(): string {
  return useContext(SystemTimezoneContext);
}
