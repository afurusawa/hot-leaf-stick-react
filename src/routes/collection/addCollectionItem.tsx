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
import { Input } from "@/components/ui/input";
import { queryClient } from "@/shared/lib/queryClient";


import { brandQueryKeys, getBrands } from "@/features/brands";
import { getCigarByName } from "@/features/cigars";
import { useCreateCollectionItem } from "@/features/collection";

import { SearchSelect } from "@/features/collection/components/search-select";
import { DatePickerInput } from "@/features/collection/components/date-picker-input";

import type { BrandGetDTO } from "@/features/brands/brand";
import type { CollectionItem } from "@/features/collection/collectionItem";

// Define the form schema with Zod for validation
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z
    .object({
      id: z.string().or(z.number()).nullable(),
      name: z.string().min(1, "Brand is required"),
    })
    .nullable(),
  vitola: z.object({
    name: z.string().min(1, "Name is required"),
    length: z.coerce
      .number({ invalid_type_error: 'Must be a number' }),
    ringGauge: z.coerce
      .number({ invalid_type_error: 'Must be a number' })
      .int('Must be a whole number'),
  }),
  quantity: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .int('Must be a whole number')
    .min(1, 'Must add at least one cigar'),
  storageDate: z.date({ message: '' }),
});

// Infer the TypeScript type from the schema
type CollectionEntryForm = z.infer<typeof formSchema>;

interface LoaderData {
  brands: BrandGetDTO[];
}

export const Route = createFileRoute("/collection/addCollectionItem")({
  component: AddCollectionItem,
  loader: async () => {
    const brands = await queryClient.ensureQueryData({
      queryKey: brandQueryKeys.brands,
      queryFn: getBrands,
    });
    return { brands };
  },
});

function AddCollectionItem() {
  const { brands } = useLoaderData({ from: '/collection/addCollectionItem' }) as LoaderData;

  // Initialize react-hook-form with Zod resolver
  const form = useForm<CollectionEntryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "fiat lux",
      brand: {
        id: "",
        name: "luciano"
      },
      vitola: {
        name: "genius",
        length: 5.5,
        ringGauge: 52,
      },
      quantity: 1,
      storageDate: new Date()
    },
  });

  const { mutate, isPending } = useCreateCollectionItem();
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (data: CollectionEntryForm) => {

    console.log(data);
    // If brand doesn't exist, set brandId to null

    const brand = brands.find((b) => b.name.toLowerCase() === data.brand?.name.toLowerCase()) || null;

    // Get cigars with the same name
    const [cigar = null] = await getCigarByName(data.name);

    // // Transform data if needed
    // const entry = {
    //   cigarId: cigar?.id || 0,
    //   brandId: brand?.id || 0,
    //   quantity: data.quantity,
    //   storageDate: data.storageDate.toISOString(),
    //   custom: {
    //     cigarName: data.name,
    //     brandName: data.brand?.name,
    //     vitola: {
    //       name: data.vitola.name,
    //       length: data.vitola.length,
    //       ringGauge: data.vitola.ringGauge,
    //     },
    //   }
    // } as CollectionItem;

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

          {/* Brand */}
          <SearchSelect
            control={form.control}
            name="brand"
            displayField="name"
            items={brands}
            label="Brand"
            placeholder="Select or enter brand"
          />

          {/* Cigar */}
          <SearchSelect
            control={form.control}
            name="cigar"
            displayField="name"
            items={cigars}
            label="Cigar"
            placeholder="Select or enter cigar name"
          />
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

          {/* Size */}
          <div className="flex flex-col sm:flex-row py-4 gap-4">

            {/* Length */}
            <FormField
              control={form.control}
              name="vitola.length"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Length (in)</FormLabel>
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
                        // Block negative numbers
                        if (e.key === ',' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      disabled={field.disabled}
                      placeholder="4.5, 5, 5.38, etc."
                      step="0.01"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ring Gauge */}
            <FormField
              control={form.control}
              name="vitola.ringGauge"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Ring Gauge</FormLabel>
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
                        // Block decimal point, comma, and negative numbers
                        if (e.key === '.' || e.key === ',' || e.key === '-') {
                          e.preventDefault();
                        }
                      }}
                      disabled={field.disabled}
                      placeholder="38, 50, 52, etc."
                      step="1"
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Quantity */}
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="py-4 gap-2">
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
                      // Block decimal point, comma, and negative numbers
                      if (e.key === '.' || e.key === ',' || e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    disabled={field.disabled}
                    placeholder="Enter quantity"
                    step="1"
                    min="0"
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
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="gap-8 py-8">
            <Button type="submit" disabled={isPending} className="w-full text-md uppercase">
              {isPending ? "Adding..." : "Add To Collection"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};