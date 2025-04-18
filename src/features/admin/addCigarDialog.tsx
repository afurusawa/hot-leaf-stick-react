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
import { Cigar } from "../collection/collectionEntry";
import { useAddCigar, useUpdateCigar } from "../collection/collectionApi";
import { cn } from "@/lib/utils";

interface AddCigarDialogProps {
  cigars: Cigar[];
  cigar?: Cigar;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess: () => void;
}

// Form schema using zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  brandName: z.string().min(1, "Brand is required"),
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
  const addMutation = useAddCigar();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brandName: ""
    },
  });

  // Reset form when item or open state changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: cigar?.name || "",
      });
    }
  }, [cigar, open, form]);


  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {

    const data = {
      ...cigar,
      name: values.name
    }

    if (isEditing) {
      updateMutation.mutate({ ...cigar, ...values }, {
        onSuccess: () => {
          onSuccess();
          form.reset();
        },
        onError: (error) => {
          console.error("Failed to add cigar:", error);
        },
      });
    } else {
      addMutation.mutate(values, {
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
            <FormField
              control={form.control}
              name="siteUrl"
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
