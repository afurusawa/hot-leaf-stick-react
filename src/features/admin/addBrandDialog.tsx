"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Brand } from "../collection/collectionEntry";
import { useAddBrand } from "../collection/collectionApi";
import { cn } from "@/lib/utils";

interface AddBrandDialogProps {
  brands: Brand[];
  onSuccess: () => void;
}

// Form schema using zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  siteUrl: z
    .string()
    .url({ message: "Invalid URL format." })
});

export function AddBrandDialog({ brands, onSuccess }: AddBrandDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useAddBrand();

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      siteUrl: "",
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    const brand: Brand = {
      name: values.name,
      siteUrl: values.siteUrl
    };

    console.log(brand);
    mutate(brand, {
      onSuccess: () => {
        onSuccess();
        setOpen(false); // Close Dialog
        form.reset();
      },
      onError: (error) => {
        console.error("Failed to add brand:", error);
      },
    });

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? "Adding..." : "Add Brand"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog >
  );
}
