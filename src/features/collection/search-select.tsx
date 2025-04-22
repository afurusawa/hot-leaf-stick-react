"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Brand } from "./collectionItem";

interface SearchSelectProps {
  control: any; // From react-hook-form
  name: string; // Form field name (e.g., "brandName")
  brands: Brand[]; // List of brand suggestions
  label?: string; // Optional label (defaults to "Brand")
  placeholder?: string; // Placeholder text
  className?: string; // For custom styling
  disabled?: boolean; // Disable the field
}

export function SearchSelect({
  control,
  name,
  brands,
  label = "Label",
  placeholder = "Enter label",
  className,
  disabled,
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("py-4 gap-2", className)}>
          <div className="flex justify-between">
            <FormLabel>{label}</FormLabel>
            <a
              className="text-sm underline cursor-pointer"
              onClick={() => {
                field.onChange("");
                setSearchQuery("");
                setOpen(false);
              }}
            >
              CLEAR
            </a>
          </div>
          <div className="flex items-center">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    {field.value || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={true}>
                  <CommandInput
                    placeholder="Search brand..."
                    value={searchQuery}
                    onValueChange={(value) => {
                      setSearchQuery(value);
                      field.onChange(value); // Update form value
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (searchQuery) {
                          field.onChange(searchQuery);
                          setOpen(false);
                        }
                      }
                    }}
                  />
                  <CommandEmpty>No brand found.</CommandEmpty>
                  <CommandGroup>
                    {brands.map((suggestion) => (
                      <CommandItem
                        key={suggestion.id}
                        value={suggestion.name}
                        onSelect={(currentValue) => {
                          field.onChange(currentValue);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === suggestion.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {suggestion.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {/* <Button
              variant="ghost"
              size="icon"
              className="ml-0"
              onClick={() => {
                field.onChange("");
                setSearchQuery("");
                setOpen(false);
              }}
              disabled={disabled}
            >
              <Delete />
            </Button> */}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}