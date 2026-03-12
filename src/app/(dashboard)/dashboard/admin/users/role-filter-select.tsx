"use client";

import { useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RoleFilterSelectProps = {
  defaultValue: string;
  placeholder: string;
  options: { value: string; label: string }[];
};

export function RoleFilterSelect({ defaultValue, placeholder, options }: RoleFilterSelectProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input type="hidden" name="role" ref={hiddenInputRef} defaultValue={defaultValue} />
      <Select
        onValueChange={(value) => {
          if (hiddenInputRef.current) {
            hiddenInputRef.current.value = value ?? "";
          }
        }}
        defaultValue={defaultValue}
      >
        <SelectTrigger id="users-role" className="w-48">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">{placeholder}</SelectItem>
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
