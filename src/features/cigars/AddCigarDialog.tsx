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

import type { BrandGetDTO } from "../brands/brand.types";
import type { CigarGetDTO, CigarCreateDTO } from "./cigar.types";
import { useCreateCigar, useUpdateCigar } from "./useCigar";
import { SearchSelect } from "../collection/components/search-select";

interface AddCigarDialogProps {
  brands: BrandGetDTO[];
  cigars: CigarGetDTO[];
  cigar: CigarGetDTO | undefined;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

// Form schema using zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  // brandName: z.string().min(1, "Brand is required"),
  brand: z
    .object({
      id: z.string().nullable(),
      name: z.string().min(1, "Brand is required"),
    })
    .nullable(),
});

export function AddCigarDialog({
  brands,
  cigars,
  cigar,
  open = false,
  onOpenChange,
  onSuccess
}: AddCigarDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!cigar;

  const updateMutation = useUpdateCigar(cigar?.id || "");
  const addMutation = useCreateCigar();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: null,
    },
  });

  // Reset form when item or open state changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: cigar?.name || "",
        brand: {
          id: cigar?.brand_id || null,
          name: cigar?.brand_name || "",
        }
      });
    }
  }, [cigar, open, form]);


  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values);
    // return;
    if (isEditing) {
      const payload = {
        name: values.name || cigar.name,
        brand_id: values.brand?.id || cigar.brand_id,
      } as CigarCreateDTO;

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
      } as CigarCreateDTO;

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
                        autoComplete="off"
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


