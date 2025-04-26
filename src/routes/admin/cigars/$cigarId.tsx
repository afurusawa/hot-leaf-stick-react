import { createFileRoute, notFound, useLoaderData, useParams } from '@tanstack/react-router';
import { queryClient } from "@/shared/lib/queryClient";
import { cigarQueryKeys, getCigarById } from '@/features/cigars';
import { CigarGetDTO } from '@/features/cigars/cigar';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon } from 'lucide-react';
import { Vitola } from '@/features/collection/collectionItem';
import { useQuery } from '@tanstack/react-query';

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

    // // Validate the cigar data
    // if (!cigar || !cigar.vitolas) {
    //   throw notFound(); // Triggers the notFoundComponent or default not-found handling
    // }

    // // return cigar;
    // const cigar = {
    //   id: params.cigarId,
    //   name: 'Test Cigar',
    //   brand_name: 'Test Brand',
    //   vitolas: [{ id: '1', name: 'Robusto', length: 5, ring_gauge: 50 }],
    // };
    // console.log('Mock cigar:', cigar);
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
      <Card className="@container/card">
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardDescription>Vitola</CardDescription>
            <div>
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                {vitola.length}x{vitola.ring_gauge}
              </Badge>
            </div>
          </div>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {vitola.name}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
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
          <Button>Add Vitola</Button>
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
