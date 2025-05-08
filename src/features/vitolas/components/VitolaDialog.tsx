import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createVitola, updateVitola } from '../vitola.api';
import { CreateVitolaDTO, UpdateVitolaDTO, VitolaResponse } from '../vitola.types';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  length: z.coerce
    .number({ invalid_type_error: 'Length must be a number' })
    .min(0.1, 'Length must be at least 0.1 inches'),
  ring_gauge: z.coerce
    .number({ invalid_type_error: 'Ring gauge must be a number' })
    .int('Ring gauge must be a whole number')
    .min(1, 'Ring gauge must be at least 1'),
});

type FormValues = z.infer<typeof formSchema>;

interface VitolaDialogProps {
  cigarId: string;
  onVitolaAdded: () => void;
  vitolaToEdit?: VitolaResponse;
  children?: React.ReactNode;
}

export function VitolaDialog({
  cigarId,
  onVitolaAdded,
  vitolaToEdit,
  children,
}: VitolaDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vitolaToEdit?.name || '',
      length: vitolaToEdit?.length || 0,
      ring_gauge: vitolaToEdit?.ring_gauge || 0,
    },
  });

  const handleClose = () => {
    setOpen(false);
    form.reset({
      name: vitolaToEdit?.name || '',
      length: vitolaToEdit?.length || 0,
      ring_gauge: vitolaToEdit?.ring_gauge || 0,
    });
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      if (vitolaToEdit) {
        const updateData: UpdateVitolaDTO = {
          id: vitolaToEdit.id,
          cigar_id: cigarId,
          ...values,
        };
        await updateVitola(vitolaToEdit.id, updateData);
      } else {
        const createData: CreateVitolaDTO = {
          cigar_id: cigarId,
          ...values,
        };
        await createVitola(createData);
      }

      setOpen(false);
      onVitolaAdded();
    } catch (err) {
      form.setError('root', {
        message: err instanceof Error ? err.message : 'An error occurred while saving the vitola',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) handleClose();
    }}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            {vitolaToEdit ? 'Edit Vitola' : 'Add Vitola'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vitolaToEdit ? 'Edit Vitola' : 'Add Vitola'}</DialogTitle>
          <DialogDescription>
            {vitolaToEdit
              ? 'Update the vitola details below.'
              : 'Add a new vitola to this cigar.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Robusto"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (inches)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="0.1"
                      step="0.01"
                      placeholder="e.g., 5.5"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ring_gauge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ring Gauge</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      step="1"
                      placeholder="e.g., 50"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <div className="text-sm text-red-500 font-medium">
                {form.formState.errors.root.message}
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : vitolaToEdit ? 'Update' : 'Add'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 