"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number | string;
  onChange?: (value: number | string) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
}

export function NumberInput({
  value = "",
  onChange,
  className,
  name,
  disabled,
  ...props
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Remove leading zero if the user types a number
    if (inputValue.startsWith("0") && inputValue.length > 1) {
      inputValue = inputValue.replace(/^0+/, "");
    }

    // Ensure only valid numbers are passed (or empty string)
    if (inputValue === "" || !isNaN(Number(inputValue))) {
      onChange?.(inputValue);
    }
  };

  return (
    <Input
      type="text" // Use text to handle leading zeros properly
      inputMode="numeric" // Optimize for numeric input on mobile
      value={value}
      onChange={handleChange}
      className={className}
      name={name}
      disabled={disabled}
      {...props}
    />
  );
}