"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "./search-select";
import { DatePickerInput } from "./date-picker-input";
import { useCreateCollectionItem } from "../useCollection";
import type { BrandGetDTO } from "@/features/brands/brand.types";
import { useQuery } from "@tanstack/react-query";
import { getCigarsByBrand } from "@/features/cigars/cigar.api";
import { getVitolasByCigar } from "@/features/vitolas/vitola.api";

// Form schema using zod
const formSchema = z.object({
  brand: z
    .object({
      id: z.string().nullable(),
      name: z.string().min(1, "Brand is required"),
    })
    .nullable(),
  cigar: z
    .object({
      id: z.string().nullable(),
      name: z.string().min(1, "Cigar is required"),
    })
    .nullable(),
  vitola: z
    .object({
      id: z.string().nullable(),
      name: z.string().min(1, "Vitola is required"),
    })
    .nullable(),
  quantity: z.coerce
    .number({ invalid_type_error: 'Quantity must be a number' })
    .int('Must be a whole number')
    .min(1, 'Must add at least one cigar'),
  storageDate: z.date({ message: 'Storage date is required' }),
});

interface AddCollectionItemDialogProps {
  brands: BrandGetDTO[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddCollectionItemDialog({
  brands,
  open = false,
  onOpenChange,
  onSuccess
}: AddCollectionItemDialogProps) {
  const { mutate, isPending } = useCreateCollectionItem();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: null,
      cigar: null,
      vitola: null,
      quantity: 1,
      storageDate: new Date(),
    },
  });

  // Watch brand selection to filter cigars
  const selectedBrand = form.watch("brand");
  const selectedCigar = form.watch("cigar");
  
  // Fetch cigars when brand is selected
  const { data: brandCigars, isLoading: isLoadingCigars } = useQuery({
    queryKey: ['cigars', selectedBrand?.id],
    queryFn: () => selectedBrand?.id ? getCigarsByBrand(selectedBrand.id) : Promise.resolve([]),
    enabled: !!selectedBrand?.id,
  });

  // Fetch vitolas when cigar is selected
  const { data: cigarVitolas, isLoading: isLoadingVitolas } = useQuery({
    queryKey: ['vitolas', selectedCigar?.id],
    queryFn: () => selectedCigar?.id ? getVitolasByCigar(selectedCigar.id) : Promise.resolve([]),
    enabled: !!selectedCigar?.id,
  });

  // Memoize filtered cigars to prevent unnecessary recalculations
  const filteredCigars = useMemo(() => {
    if (!selectedBrand?.id) return [];
    return brandCigars || [];
  }, [brandCigars, selectedBrand]);

  // Memoize filtered vitolas based on selected cigar
  const filteredVitolas = useMemo(() => {
    if (!selectedCigar?.id) return [];
    return cigarVitolas || [];
  }, [cigarVitolas, selectedCigar]);

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.brand?.id || !values.cigar?.id || !values.vitola?.id) {
      return;
    }

    const payload = {
      brand_id: values.brand.id,
      cigar_id: values.cigar.id,
      vitola_id: values.vitola.id,
      quantity: values.quantity,
      storage_date: values.storageDate,
    };

    mutate(payload, {
      onSuccess: () => {
        onSuccess();
        form.reset();
      },
      onError: (error: Error) => {
        console.error("Failed to add collection item:", error);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add to Collection</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Add a new cigar to your collection.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Brand Selection */}
            <SearchSelect
              control={form.control}
              name="brand"
              displayField="name"
              items={brands}
              label="Brand"
              placeholder="Select or enter brand"
            />

            {/* Cigar Selection */}
            <SearchSelect
              control={form.control}
              name="cigar"
              displayField="name"
              items={filteredCigars}
              label="Cigar"
              placeholder={selectedBrand ? (isLoadingCigars ? "Loading cigars..." : "Select or enter cigar") : "Select a brand first"}
              disabled={!selectedBrand || isLoadingCigars}
            />

            {/* Vitola Selection */}
            <SearchSelect
              control={form.control}
              name="vitola"
              displayField="name"
              items={filteredVitolas}
              label="Vitola"
              placeholder={selectedCigar ? (isLoadingVitolas ? "Loading vitolas..." : "Select or enter vitola") : "Select a cigar first"}
              disabled={!selectedCigar || isLoadingVitolas}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/^0+/, '') || '';
                        field.onChange(value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === '.' || e.key === ',' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      placeholder="Enter quantity"
                      step="1"
                      min="1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Storage Date */}
            <FormField
              control={form.control}
              name="storageDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Storage Date</FormLabel>
                  <FormControl>
                    <DatePickerInput
                      value={field.value}
                      onChange={field.onChange}
                      id="storage-date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add to Collection"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


