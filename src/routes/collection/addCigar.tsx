"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { queryClient } from "@/lib/queryClient";
import { cigarQueryKeys, getBrands, useAddCigar } from "../../features/collection/collectionApi";
import { CollectionEntry } from "@/features/collection/collectionEntry";
import { DatePicker } from "@/features/collection/date-picker";
import { NumberInput } from "@/features/collection/number-input";
import { SearchSelect } from "@/features/collection/search-select";

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

  // Initialize react-hook-form with Zod resolver
  const form = useForm<CollectionEntryForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "fiat lux",
      brandName: "luciano",
      quantity: 0,
      vitola: {
        name: "genius",
        length: 5.5,
        ringGauge: 52,
      },
      storageDate: (new Date())
    },
  });

  const { mutate, isPending } = useAddCigar();
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = (data: CollectionEntryForm) => {

    console.log(data);
    // What if the brand doesn't exist in the db?

    // Get cigars with the same name

    // // Transform data if needed
    // const entry = {
    //   cigarId: "unknown",
    //   brandId: "unknown",
    //   quantity: data.quantity,
    //   vitola: {
    //     name: data.vitola.name,
    //     length: data.vitola.length,
    //     ringGauge: data.vitola.ringGauge,
    //   },
    //   storageDate: Date().toString(),
    // } as CollectionEntry;

    // mutate(entry, {
    //   onSuccess: () => {
    //     form.reset(); // Clear form
    //     navigate({ to: "/collection" }); // Navigate to CollectionPage
    //   },
    //   onError: (error) => {
    //     console.error("Failed to add cigar:", error);
    //   },
    // });
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

          <SearchSelect
            control={form.control}
            name="brandName"
            brands={brands}
            label="Brand"
            placeholder="Select or enter brand"
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

          <div className="flex flex-col sm:flex-row gap-4">
            <FormField
              control={form.control}
              name="vitola.length"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Length (in)</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value ?? ""}
                      onChange={(value) =>
                        field.onChange(value === "" ? undefined : parseFloat(value))
                      }
                      disabled={field.disabled}
                      placeholder="e.g., 4.5, 5, 5.38"
                      step="0.01"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vitola.ringGauge"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Ring Gauge</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value ?? ""}
                      onChange={(value) =>
                        field.onChange(value === "" ? undefined : parseInt(value))
                      }
                      disabled={field.disabled}
                      placeholder="e.g., 38, 50, 52"
                      step="1"
                      className="w-full"
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
                  <NumberInput
                    value={field.value ?? ""}
                    onChange={(value) =>
                      field.onChange(value === "" ? undefined : Number(value))
                    }
                    disabled={field.disabled}
                    placeholder="Enter quantity"
                  />
                </FormControl>
                <FormDescription>
                  Enter the number of cigars.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Storage Date */}
          <FormField
            control={form.control}
            name="storageDate"
            render={({ field }) => (
              <FormItem className="py-4 gap-2">
                <FormLabel>Storage Date</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    dateFormat="MM/dd/yyyy"
                    placeholder="Select a date"
                    disabled={field.disabled}
                  />
                </FormControl>
                <FormDescription>
                  Select the date received this cigar.
                </FormDescription>
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