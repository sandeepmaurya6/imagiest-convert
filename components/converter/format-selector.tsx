'use client';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FORMAT_CATEGORIES, type ConversionFormat } from "@/lib/constants";

interface FormatSelectorProps {
  value: ConversionFormat;
  onChange: (value: ConversionFormat) => void;
  disabled?: boolean;
}

export function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value as ConversionFormat)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select format" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(FORMAT_CATEGORIES).map(([category, { label, formats }]) => (
          <SelectGroup key={category}>
            <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
              {label}
            </SelectLabel>
            {Object.entries(formats).map(([value, { label }]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}