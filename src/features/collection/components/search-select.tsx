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

interface SearchSelectProps<T extends { id: string }> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any; // From react-hook-form
  name: string; // Form field name (e.g., "brand")
  items: T[]; // List of items (replacing brands)
  displayField?: keyof T; // Field to use for display and search (e.g., "name")
  label?: string; // Optional label
  placeholder?: string; // Placeholder text
  className?: string; // For custom styling
  disabled?: boolean; // Disable the field
  editable?: boolean; // Allow free-text input
}

export function SearchSelect<T extends { id: string }>({
  control,
  name,
  items,
  displayField = "name" as keyof T, // Default to "name"
  label = "Label",
  placeholder = "Enter label",
  className,
  disabled,
  editable = false,
}: SearchSelectProps<T>) {
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
                field.onChange(null); // Clear the field
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
                    {field.value && field.value[displayField]
                      ? String(field.value[displayField])
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={true}>
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                    value={searchQuery}
                    onValueChange={(value) => {
                      setSearchQuery(value);
                    }}
                    onKeyDown={(e) => {
                      if (editable && e.key === "Enter") {
                        e.preventDefault();
                        if (searchQuery) {
                          // Optionally handle free-text input
                          field.onChange({ [displayField]: searchQuery } as T);
                          setOpen(false);
                        }
                      }
                    }}
                  />
                  <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        key={item.id ?? String(item[displayField])}
                        value={String(item[displayField])}
                        onSelect={() => {
                          field.onChange(item); // Store the entire item object
                          setSearchQuery(String(item[displayField]));
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value?.id === item.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {String(item[displayField])}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}