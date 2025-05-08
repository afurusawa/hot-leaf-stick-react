import { Key, useState } from "react";
import { createFileRoute, useLoaderData, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/shared/lib/queryClient";
import { getRelativeDateString } from "@/shared/lib/utils";
import { brandQueryKeys, getBrands } from "@/features/brands";
import { collectionQueryKeys, getCollection, useQueryCollection } from "@/features/collection";
import { CollectionGetDTO } from "@/features/collection/CollectionItem.types";
import { BrandGetDTO } from "@/features/brands/brand.types";
import { AddCollectionItemDialog } from "@/features/collection/components/AddCollectionItemDialog";
import { cigarQueryKeys, getCigars } from "@/features/cigars";
import { getVitolas, vitolaQueryKeys } from "@/features/vitolas";
import type { CigarGetDTO } from "@/features/cigars/cigar.types";
import type { VitolaResponse } from "@/features/vitolas/vitola.types";

interface LoaderData {
  items: CollectionGetDTO[];
  brands: BrandGetDTO[];
  cigars: CigarGetDTO[];
  vitolas: VitolaResponse[];
}

export const Route = createFileRoute("/_sidebar/collection/")({
  component: Collection,
  loader: async () => {
    const items = await queryClient.ensureQueryData({
      queryKey: collectionQueryKeys.all,
      queryFn: getCollection,
    });

    const brands = await queryClient.ensureQueryData({
      queryKey: brandQueryKeys.brands,
      queryFn: getBrands,
    });

    const cigars = await queryClient.ensureQueryData({
      queryKey: cigarQueryKeys.cigars,
      queryFn: getCigars,
    });

    const vitolas = await queryClient.ensureQueryData({
      queryKey: vitolaQueryKeys.vitolas,
      queryFn: getVitolas,
    });

    return { items, brands, cigars, vitolas };
  }
});

function Collection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: items = [] } = useQueryCollection();
  const { brands, cigars, vitolas } = useLoaderData({ from: '/_sidebar/collection/' }) as LoaderData;

  const renderCard = (item: CollectionGetDTO) => {
    return (
      <Card className="w-[300px] h-[250px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            {item.cigar?.name || "Unknown Cigar"} {item.vitola?.name}
          </CardTitle>
          <CardDescription>
            {item.cigar?.brand?.name || "Unknown Brand"}
            <Badge variant="outline" className="ml-4">
             {item.vitola?.length} x {item.vitola?.ring_gauge}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Qty: {item.quantity}</p>
          <p>Stored for {getRelativeDateString(item.storage_date)}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between w-full">
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <Card className="w-[300px] h-[250px] flex flex-col justify-between bg-transparent border-gray-500">
          <CardHeader>
            <CardTitle>
              Add Cigars
            </CardTitle>
            <CardDescription>
              Add new cigars to your collection
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {/* <Plus className="w-16 h-16 opacity-50" /> */}
          </CardContent>
          <CardFooter className="flex items-end justify-between">
              <AddCollectionItemDialog
                brands={brands}
                cigars={cigars}
                vitolas={vitolas}
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                }}
                onSuccess={() => {
                  setIsDialogOpen(false);
                }}
              />
          </CardFooter>
        </Card>

        {items.map((item: CollectionGetDTO, index: Key | null | undefined) => (
          <div key={index}>
            {renderCard(item)}
          </div>
        ))}
      </div>
    </div>
  );
}