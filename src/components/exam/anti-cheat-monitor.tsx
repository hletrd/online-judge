"use client";

import { useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api/client";

interface AntiCheatMonitorProps {
  assignmentId: string;
  enabled: boolean;
  warningMessage?: string;
}

/**
 * Client-side anti-cheat monitor.
 * Detects tab switches, copy, paste, blur, and contextmenu events.
 * Reports events to the server API.
 */
export function AntiCheatMonitor({
  assignmentId,
  enabled,
  warningMessage = "Tab switch detected. This event has been recorded.",
}: AntiCheatMonitorProps) {
  const lastEventRef = useRef<number>(0);
  const MIN_INTERVAL_MS = 1000; // Rate limit client-side events

  const reportEvent = useCallback(
    async (eventType: string, details?: Record<string, unknown>) => {
      const now = Date.now();
      if (now - lastEventRef.current < MIN_INTERVAL_MS) return;
      lastEventRef.current = now;

      try {
        await apiFetch(`/api/v1/contests/${assignmentId}/anti-cheat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventType,
            details: details ? JSON.stringify(details) : undefined,
          }),
        });
      } catch {
        // silently fail
      }
    },
    [assignmentId]
  );

  useEffect(() => {
    if (!enabled) return;

    function handleVisibilityChange() {
      if (document.hidden) {
        reportEvent("tab_switch");
        toast.warning(warningMessage);
      }
    }

    function handleBlur() {
      reportEvent("blur");
    }

    function handleCopy(e: ClipboardEvent) {
      reportEvent("copy", {
        target: (e.target as HTMLElement)?.tagName,
      });
    }

    function handlePaste(e: ClipboardEvent) {
      reportEvent("paste", {
        target: (e.target as HTMLElement)?.tagName,
      });
    }

    function handleContextMenu(_e: MouseEvent) {
      // Log the event but do not prevent default — preserves accessibility
      reportEvent("contextmenu");
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enabled, reportEvent, warningMessage]);

  // This component renders nothing — it's purely side-effect based
  return null;
}
