import { createFileRoute, useLoaderData, useParams } from '@tanstack/react-router';
import { queryClient } from "@/shared/lib/queryClient";
import { cigarQueryKeys, getCigarById } from '@/features/cigars';
import { CigarGetDTO } from '@/features/cigars/cigar.types';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { PencilIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { VitolaDialog } from '@/features/vitolas';
import { Button } from "@/components/ui/button";
import type { VitolaResponse } from '@/features/vitolas/vitola.types';

interface LoaderData {
  cigar: CigarGetDTO;
}

export const Route = createFileRoute('/_sidebar/admin/cigars/$cigarId')({
  component: CigarDetails,
  loader: async ({ params }) => {
    const cigar = await queryClient.ensureQueryData({
      queryKey: cigarQueryKeys.cigarById(params.cigarId),
      queryFn: () => getCigarById(params.cigarId),
    });
    return { cigar } as LoaderData;
  }
});

function CigarDetails() {
  const { cigarId } = useParams({ from: '/_sidebar/admin/cigars/$cigarId' });
  const { cigar: initial } = useLoaderData({ from: '/_sidebar/admin/cigars/$cigarId' }) as LoaderData;
  const { data: cigar } = useQuery({
    queryKey: cigarQueryKeys.cigarById(cigarId),
    queryFn: () => getCigarById(cigarId),
    initialData: initial,
    staleTime: 0,
  });

  const renderCard = (vitola: VitolaResponse) => {
    return (
      <Card key={vitola.id} className="@container/card hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap pr-8">
              <CardTitle className="@[250px]/card:text-2xl text-xl font-semibold">
                {vitola.name}
              </CardTitle>
              <Badge variant="outline" className="flex items-center rounded-lg text-sm">
                <span className="font-medium">{vitola.length}"</span>
                <span className="text-muted-foreground">×</span>
                <span className="font-medium">{vitola.ring_gauge}</span>
              </Badge>
            </div>
            <VitolaDialog
              cigarId={cigarId}
              onVitolaAdded={() => {
                queryClient.invalidateQueries({ queryKey: cigarQueryKeys.cigarById(cigarId) });
              }}
              vitolaToEdit={vitola}
            >
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                <PencilIcon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
              </Button>
            </VitolaDialog>
          </div>
        </CardHeader>
      </Card>
    );
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{cigar.name}</h1>
        <VitolaDialog
          cigarId={cigarId}
          onVitolaAdded={() => {
            queryClient.invalidateQueries({ queryKey: cigarQueryKeys.cigarById(cigarId) });
          }}
        >
          <Button>Add Vitola</Button>
        </VitolaDialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cigar.vitolas?.map(renderCard)}
      </div>
    </div>
  );
}
