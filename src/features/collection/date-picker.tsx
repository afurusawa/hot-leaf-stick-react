"use client";

import { useEffect, useState } from 'react';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  dateFormat?: string;
  placeholder?: string;
  className?: string;
  name?: string; // For form field identification
  disabled?: boolean; // Optional: to disable the field
}

export function DatePicker({
  value,
  onChange,
  dateFormat = "PPP",
  placeholder = "Pick a date",
  className,
  disabled,
}: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value);

  // Sync external value changes
  useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange?.(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          aria-label={placeholder}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, dateFormat) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          // onSelect={setDate}
          captionLayout="dropdown-buttons" // Adds year/month dropdowns
          fromYear={1900} // Set the earliest year
          toYear={2025} // Set the latest year
          initialFocus
          disabled={disabled}
        />
        {/* <Calendar
          mode="single"
          selected={date}
          initialFocus
        /> */}
      </PopoverContent>
    </Popover>
  );
}