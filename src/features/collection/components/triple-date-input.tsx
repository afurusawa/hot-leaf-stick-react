import * as React from "react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/components/ui/input";

interface TripleDateInputProps {
  value?: Date;
  onChange: (date?: Date) => void;
  id?: string;
  className?: string;
}

export function TripleDateInput({
  value,
  onChange,
  id = "date-input",
  className,
}: TripleDateInputProps) {
  const [month, setMonth] = React.useState<string>("");
  const [day, setDay] = React.useState<string>("");
  const [year, setYear] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  const monthRef = React.useRef<HTMLInputElement>(null);
  const dayRef = React.useRef<HTMLInputElement>(null);
  const yearRef = React.useRef<HTMLInputElement>(null);

  // Sync inputs with value
  React.useEffect(() => {
    if (value && isValid(value)) {
      setMonth(format(value, "MM"));
      setDay(format(value, "dd"));
      setYear(format(value, "yyyy"));
      setError(null);
    } else {
      setMonth("");
      setDay("");
      setYear("");
      setError(null);
    }
  }, [value]);

  // Validate and update date
  const updateDate = React.useCallback(() => {
    if (month.length === 2 && day.length === 2 && year.length === 4) {
      const dateStr = `${month}/${day}/${year}`;
      try {
        const parsedDate = parse(dateStr, "MM/dd/yyyy", new Date());
        if (isValid(parsedDate)) {
          onChange(parsedDate);
          setError(null);
        } else {
          setError("Invalid date.");
          onChange(undefined);
        }
      } catch {
        setError("Invalid date.");
        onChange(undefined);
      }
    } else {
      setError(null);
      onChange(undefined);
    }
  }, [month, day, year, onChange]);

  React.useEffect(() => {
    updateDate();
  }, [month, day, year, updateDate]);


  // Handle input change with auto-focus
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "month" | "day" | "year",
    nextRef?: React.RefObject<HTMLInputElement>,
    prevRef?: React.RefObject<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Numbers only
    let maxLength = field === "year" ? 4 : 2;

    if (value.length <= maxLength) {
      if (field === "month") setMonth(value);
      else if (field === "day") setDay(value);
      else setYear(value);

      // Auto-focus next field after max digits
      if (value.length === maxLength && nextRef?.current) {
        nextRef.current.focus();
      }
    }

    // Basic validation
    if (field === "month" && value.length === 2 && (parseInt(value) < 1 || parseInt(value) > 12)) {
      setError("Month must be 01-12.");
    } else if (field === "day" && value.length === 2 && (parseInt(value) < 1 || parseInt(value) > 31)) {
      setError("Day must be 01-31.");
    } else if (field === "year" && value.length === 4 && (parseInt(value) < 1900 || parseInt(value) > 2025)) {
      setError("Year must be 1900-2025.");
    } else {
      setError(null);
    }
  };

  // Handle key down for deletion and focus
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: "month" | "day" | "year",
    prevRef?: React.RefObject<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && e.currentTarget.value === "" && prevRef?.current) {
      prevRef.current.focus();
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="grid gap-1">
        <Input
          id={`${id}-month`}
          value={month}
          onChange={(e) => handleInputChange(e, "month", dayRef)}
          placeholder="MM"
          className={cn(
            "w-[60px] text-sm",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          maxLength={2}
          ref={monthRef}
          aria-label="Month"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <div className="grid gap-1">
        <Input
          id={`${id}-day`}
          value={day}
          onChange={(e) => handleInputChange(e, "day", yearRef)}
          placeholder="DD"
          className={cn(
            "w-[60px] text-sm",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          maxLength={2}
          ref={dayRef}
          aria-label="Day"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      <div className="grid gap-1">
        <Input
          id={`${id}-year`}
          value={year}
          onChange={(e) => handleInputChange(e, "year")}
          placeholder="YYYY"
          className={cn(
            "w-[80px] text-sm",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          maxLength={4}
          ref={yearRef}
          aria-label="Year"
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
};
