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
import type { BrandGetDTO } from "@/features/brands/brand";
import type { CigarGetDTO, CigarPayload } from "@/features/cigars/cigar";
import { useAddCigar, useUpdateCigar } from "@/features/cigars";
import { SearchSelect } from "./search-select";
import { useAddCollectionItem } from "../useCollection";

interface AddCollectionItemDialogProps {
  brands: BrandGetDTO[];
  cigars: CigarGetDTO[];
  cigar: CigarGetDTO | undefined;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  brand: z.object({
    id: z.string().nullable(), // id can be null, but brand object itself is required
    name: z.string().min(1, "Brand is required"),
  }),
  cigar: z.object({
    id: z.string().nullable(), // id can be null, but cigar object itself is required
    name: z.string().min(1, "Name is required"),
  }),
  vitola: z.object({
    id: z.string().nullable(), // id can be null, but vitola object itself is required
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
  storageDate: z.date({ required_error: 'Storage date is required' }),
});

export function AddCollectionItemDialog({
  brands,
  open = false,
  onOpenChange,
  onSuccess
}: AddCollectionItemDialogProps) {
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateCigar(cigar?.id || "");
  const addMutation = useAddCollectionItem();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: undefined,
      cigar: undefined,
      vitola: undefined,
      quantity: 0,
      storageDate: new Date(),
    },
  });

  // Reset form when item or open state changes
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);


  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    // return;
    if (isEditing) {
      const payload = {
        name: values.name || cigar.name,
        brand_id: values.brand?.id || cigar.brand_id,
      } as CigarPayload;

      updateMutation.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          form.reset();
        },
        onError: (error) => {
          console.error("Failed to add cigar:", error);
        },
      });
    } else {

      // POST
      const payload = {
        name: values.name,
        brand_id: values.brand?.id,
      } as CigarPayload;

      addMutation.mutate(payload, {
        onSuccess: () => {
          onSuccess();
          form.reset();
        },
        onError: (error) => {
          console.error("Failed to update cigar:", error);
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Cigar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Cigar</DialogTitle>
          <DialogDescription>
            Add cigar cigars here.
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
                        id="cigar-name"
                        placeholder="Cigar name"
                        className={cn(
                          "text-sm",
                          error && "border-destructive focus-visible:ring-destructive"
                        )}
                        {...field}
                        onChange={(e) => {
                          const cigarName = e.target.value;
                          const isFound = !!cigars.find((b) => b.name === cigarName);
                          if (isFound) {
                            setError("Cigar already exists.");
                          } else {
                            setError(null);
                          }
                          field.onChange(cigarName);
                        }}
                      />
                      {error && (
                        <p id={`cigar-name-error`} className="text-sm text-destructive">
                          {error}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand */}
            <SearchSelect
              control={form.control}
              name="brand"
              displayField="name"
              items={brands}
              label="Brand"
              placeholder="Select or enter brand"
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
                    isEditing ? "Update Cigar" : "Add Cigar"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  );
}


