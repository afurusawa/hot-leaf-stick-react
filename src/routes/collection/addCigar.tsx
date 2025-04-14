"use client";

import { useForm } from "react-hook-form";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { queryClient } from "@/lib/queryClient";
import { cigarQueryKeys, getBrands, useAddCigar } from "../../features/collection/collectionApi";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { CollectionEntry } from "@/features/collection/collectionEntry";

// Define the form schema with Zod for validation
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brandName: z.string().min(1, "Brand is required"),
  quantity: z.number().min(1, "Quantity is required"),
  storageDate: z.date().optional(),
  vitola: z.object({
    name: z.string().optional(),
    length: z.number().optional(),
    ringGauge: z.number().optional(),
  }),
});

// Infer the TypeScript type from the schema
type CollectionEntryForm = z.infer<typeof formSchema>;

interface LoaderData {
  brands: { id: string; name: string }[];
}

export const Route = createFileRoute("/collection/addCigar")({
  component: AddCigar,
  loader: async () => {
    const brands = await queryClient.ensureQueryData({
      queryKey: cigarQueryKeys.brands,
      queryFn: getBrands,
    });
    return { brands };
  },
});

function AddCigar() {
  const { brands } = useLoaderData({ from: '/collection/addCigar' }) as LoaderData;
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize react-hook-form with Zod resolver
  const form = useForm<CollectionEntryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brandName: "",
      quantity: 1,
      vitola: {
        name: "",
        length: undefined,
        ringGauge: undefined,
      },
    },
  });

  const { mutate, isPending } = useAddCigar();
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = (data: CollectionEntryForm) => {
    // Transform data if needed
    const entry = {
      cigarId: "unknown",
      quantity: data.quantity,
      vitola: {
        name: data.vitola.name,
        length: data.vitola.length,
        ringGauge: data.vitola.ringGauge,
      },
      storageDate: data.storageDate ? data.storageDate.toISOString() : undefined,
    } as CollectionEntry;

    mutate(entry, {
      onSuccess: () => {
        form.reset(); // Clear form
        navigate({ to: "/collection" }); // Navigate to CollectionPage
      },
      onError: (error) => {
        console.error("Failed to add cigar:", error);
      },
    });
  };

  return (
    <div className="flex flex-col mx-auto gap-4 items-center w-full">
      <h1 className="text-2xl font-bold">Add Cigar</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="py-4 gap-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Cohiba" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem className="py-4 gap-2">
                <FormLabel>Brand</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value || 'Enter brand'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => {
                      form.setValue('brandName', '');
                      setSearchQuery('');
                      setOpen(false);
                    }}
                  >
                    X
                  </Button>
                  <PopoverContent className="w-full p-0">
                    <Command shouldFilter={true}>
                      <CommandInput
                        placeholder="Search brand..."
                        value={searchQuery}
                        onValueChange={(value) => {
                          setSearchQuery(value);
                          form.setValue('brandName', value); // Update form value with input
                          //fetchSuggestions(value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent form submission
                            if (searchQuery) {
                              form.setValue('brandName', searchQuery); // Confirm current input
                              setOpen(false); // Close popover
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
                              form.setValue('brandName', currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                field.value === suggestion.name
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {suggestion.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vitola */}
          <FormField
            control={form.control}
            name="vitola.name"
            render={({ field }) => (
              <FormItem className="py-4 gap-2">
                <FormLabel>Vitola</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Salomon, Edmundo, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vitola.length"
            render={({ field }) => (
              <FormItem className="py-4 gap-2">
                <FormLabel>Length (in)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 4.5, 5, 7, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vitola.ringGauge"
            render={({ field }) => (
              <FormItem className="py-4 gap-2">
                <FormLabel>Ring</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 38, 50, 52, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="py-4 gap-2">
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="gap-8 py-8">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Adding..." : "Add Cigar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};