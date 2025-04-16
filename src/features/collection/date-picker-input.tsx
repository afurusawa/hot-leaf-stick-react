import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface DatePickerInputProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function DatePickerInput({
  value,
  onChange,
  placeholder = "MM/DD/YYYY",
  id = "date-input",
  className,
}: DatePickerInputProps) {
  const [inputValue, setInputValue] = React.useState<string>(() =>
    value && isValid(value) ? format(value, "MM/dd/yyyy") : ""
  );
  const [error, setError] = React.useState<string | null>(null);

  // Handle input change with auto-slash insertion
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9/]/g, ""); // Allow only numbers and slashes

    setInputValue(value);

    // Automatically add slashes
    if (value.length == 2 || value.length == 5) {
      value += "/";
      setInputValue(value);
    }

    // Validate if input is complete (MM/DD/YYYY)
    if (value.length === 10) {
      try {
        const parsedDate = parse(value, "MM/dd/yyyy", new Date());
        if (isValid(parsedDate)) {
          onChange(parsedDate);
          setError(null);
        } else {
          setError("Invalid date");
          onChange(undefined);
        }
      } catch {
        setError("Invalid date");
        onChange(undefined);
      }
    } else {
      setError(null);
      if (value.length < 10) {
        onChange(undefined);
      }
    }
  };

  // Handle key down to improve deletion experience. This triggers before onChange
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputValue.length == 3 || inputValue.length == 6) {
      if (e.key === "Backspace") {
        e.preventDefault();
        setInputValue(inputValue.slice(0, -2));
      }
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Input
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "text-sm",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        maxLength={10}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
