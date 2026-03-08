"use client";

import { Input } from "@/components/ui/input";

type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function DateTimeInput({ value, onChange }: DateTimeInputProps) {
  const normalized = value ? value.slice(0, 16) : "";
  return (
    <Input
      type="datetime-local"
      value={normalized}
      onChange={(e) => {
        if (!e.target.value) {
          onChange("");
          return;
        }
        onChange(new Date(e.target.value).toISOString());
      }}
    />
  );
}
