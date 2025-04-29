import { createFileRoute, useLoaderData, useParams } from '@tanstack/react-router';
import { queryClient } from "@/shared/lib/queryClient";
import { cigarQueryKeys, getCigarById } from '@/features/cigars';
import { CigarGetDTO } from '@/features/cigars/cigar';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, PencilIcon } from 'lucide-react';
import { Vitola } from '@/features/collection/collectionItem';
import { useQuery } from '@tanstack/react-query';
import { VitolaDialog } from '@/features/vitolas';
import { Button } from "@/components/ui/button";

interface LoaderData {
  cigar: CigarGetDTO;
}

export const Route = createFileRoute('/admin/cigars/$cigarId')({
  component: CigarDetails,
  loader: async ({ params }) => {
    console.log(params.cigarId);
    const cigar = await queryClient.ensureQueryData({
      queryKey: cigarQueryKeys.cigarById(params.cigarId),
      queryFn: () => getCigarById(params.cigarId),
    });
    return { cigar } as LoaderData;
  }
});

function CigarDetails() {
  const { cigarId } = useParams({ from: '/admin/cigars/$cigarId' });
  const { cigar: initial } = useLoaderData({ from: '/admin/cigars/$cigarId' }) as LoaderData;
  const { data: cigar } = useQuery({
    queryKey: cigarQueryKeys.cigarById(cigarId),
    queryFn: () => getCigarById(cigarId),
    initialData: initial,
    staleTime: 0,
  });

  const renderCard = (vitola: Vitola) => {
    return (
      <Card className="@container/card hover:shadow-lg transition-shadow duration-200">
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
              existingVitolas={cigar.vitolas || []}
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
        <CardFooter className="border-t pt-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUpIcon className="h-4 w-4" />
            <span>Trending this month</span>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex px-6 items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl">{cigar.name}</h1>
          <h2 className="text-xl text-gray-500">by {cigar.brand_name}</h2>
        </div>
        <div className="flex">
          <VitolaDialog
            cigarId={cigarId}
            existingVitolas={cigar.vitolas || []}
            onVitolaAdded={() => {
              queryClient.invalidateQueries({ queryKey: cigarQueryKeys.cigarById(cigarId) });
            }}
          >
            <Button variant="outline" size="sm">
              Add Vitola
            </Button>
          </VitolaDialog>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
              {cigar.vitolas?.map((vitola) => (
                <div key={vitola.id}>
                  {renderCard(vitola)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
