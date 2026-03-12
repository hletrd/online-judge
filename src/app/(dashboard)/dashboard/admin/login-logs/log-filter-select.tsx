"use client";

import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LogFilterSelectProps {
  name: string;
  defaultValue: string;
  placeholder: string;
  options: { value: string; label: string }[];
}

export function LogFilterSelect({ name, defaultValue, placeholder, options }: LogFilterSelectProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input type="hidden" name={name} ref={inputRef} defaultValue={defaultValue} />
      <Select
        defaultValue={defaultValue}
        onValueChange={(value) => {
          if (inputRef.current) inputRef.current.value = value ?? "";
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
