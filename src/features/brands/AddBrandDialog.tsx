"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { cn } from "@/shared/lib/utils";
import { useCreateBrand, useUpdateBrand } from ".";
import type { BrandGetDTO } from "./brand.types";

interface AddBrandDialogProps {
  brands: BrandGetDTO[];
  brand: BrandGetDTO | undefined;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

// Form schema using zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  site_url: z
    .string()
    .url({ message: "Invalid URL format." })
});

export function AddBrandDialog({
  brands,
  brand,
  open = false,
  onOpenChange,
  onSuccess
}: AddBrandDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!brand;

  const updateMutation = useUpdateBrand(brand?.id || "");
  const addMutation = useCreateBrand();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      site_url: "",
    },
  });

  // Reset form when item or open state changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: brand?.name || "",
        site_url: brand?.site_url || "",
      });
    }
  }, [brand, open, form]);


  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (isEditing) {
      updateMutation.mutate({ ...values }, {
        onSuccess: () => {
          onSuccess();
          form.reset();
        },
        onError: (error) => {
          console.error("Failed to add brand:", error);
        },
      });
    } else {
      addMutation.mutate(values, {
        onSuccess: () => {
          onSuccess();
          form.reset();
        },
        onError: (error) => {
          console.error("Failed to update brand:", error);
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Brand</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Brand</DialogTitle>
          <DialogDescription>
            Add cigar brands here.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="grid gap-2">
                      <Input
                        id="brand-name"
                        placeholder="Brand name"
                        className={cn(
                          "text-sm",
                          error && "border-destructive focus-visible:ring-destructive"
                        )}
                        {...field}
                        onChange={(e) => {
                          const brandName = e.target.value;
                          const isFound = !!brands.find((b) => b.name === brandName);
                          if (isFound) {
                            setError("Brand already exists.");
                          } else {
                            setError(null);
                          }
                          field.onChange(brandName);
                        }}
                      />
                      {error && (
                        <p id={`brand-name-error`} className="text-sm text-destructive">
                          {error}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Website URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {
                isEditing &&
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
              }
              <Button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
              >
                {
                  addMutation.isPending || updateMutation.isPending ?
                    isEditing ? "Updating..." : "Adding..." :
                    isEditing ? "Update Brand" : "Add Brand"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  );
}
