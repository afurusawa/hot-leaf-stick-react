import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createVitola, updateVitola } from '../vitola.api';
import { Vitola, CreateVitolaDTO, UpdateVitolaDTO } from '../vitola.types';

interface VitolaDialogProps {
  cigarId: string;
  onVitolaAdded: () => void;
  vitolaToEdit?: Vitola;
}

export function VitolaDialog({
  cigarId,
  onVitolaAdded,
  vitolaToEdit,
}: VitolaDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(vitolaToEdit?.name || '');
  const [length, setLength] = useState(vitolaToEdit?.length?.toString() || '');
  const [ringGauge, setRingGauge] = useState(vitolaToEdit?.ring_gauge?.toString() || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (vitolaToEdit) {
        const updateData: UpdateVitolaDTO = {
          id: vitolaToEdit.id,
          cigar_id: cigarId,
          name,
          length: Number(length),
          ring_gauge: Number(ringGauge),
        };
        await updateVitola(vitolaToEdit.id, updateData);
      } else {
        const createData: CreateVitolaDTO = {
          cigar_id: cigarId,
          name,
          length: Number(length),
          ring_gauge: Number(ringGauge),
        };
        await createVitola(createData);
      }

      setOpen(false);
      onVitolaAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {vitolaToEdit ? 'Edit Vitola' : 'Add Vitola'}
        </Button>
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Robusto"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="length">Length (inches)</Label>
              <Input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 5"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ringGauge">Ring Gauge</Label>
              <Input
                id="ringGauge"
                type="number"
                value={ringGauge}
                onChange={(e) => setRingGauge(e.target.value)}
                placeholder="e.g., 50"
                required
              />
            </div>
            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : vitolaToEdit ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 