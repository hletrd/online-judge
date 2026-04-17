"use client";

import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";

interface HashTabsProps extends React.ComponentProps<typeof Tabs> {
  defaultValue: string;
}

export function HashTabs({ defaultValue, children, ...props }: HashTabsProps) {
  const [value, setValue] = useState(defaultValue);

  // Read hash after hydration to avoid SSR mismatch
  useEffect(() => {
    const hashValue = window.location.hash.slice(1);
    if (!hashValue) return;

    const frame = window.requestAnimationFrame(() => {
      setValue(hashValue);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleChange = (newValue: string | number | null) => {
    const v = String(newValue ?? defaultValue);
    setValue(v);
    window.history.replaceState(null, "", `#${v}`);
  };

  return (
    <Tabs value={value} onValueChange={handleChange} {...props}>
      {children}
    </Tabs>
  );
}
