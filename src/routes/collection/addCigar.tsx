"use client";

import { useForm } from "react-hook-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { useAddCigar } from "../../features/collection/collectionApi";

// Define the form schema with Zod for validation
const cigarFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().min(1, "Brand is required"),
  price: z.number().min(0, "Price must be positive"),
});

// Infer the TypeScript type from the schema
type CigarForm = z.infer<typeof cigarFormSchema>;

// Route
export const Route = createFileRoute("/collection/addCigar")({
  component: AddCigar,
});

function AddCigar() {
  // Initialize react-hook-form with Zod resolver
  const form = useForm<CigarForm>({
    resolver: zodResolver(cigarFormSchema),
    defaultValues: {
      name: "",
      brand: "",
      price: 0,
    },
  });

  const { mutate, isPending } = useAddCigar();
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = (data: CigarForm) => {
    mutate(data, {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cohiba Robusto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cohiba" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 25.99"
                  {...field}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="sm:col-span-2">
          {isPending ? "Adding..." : "Add Cigar"}
        </Button>
      </form>
    </Form>
  );
};