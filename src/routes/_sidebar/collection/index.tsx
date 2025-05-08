import { Key, useState } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
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

interface LoaderData {
  items: CollectionGetDTO[];
  brands: BrandGetDTO[];
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

    return { items, brands };
  }
});

function Collection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: items = [] } = useQueryCollection();
  const { brands } = useLoaderData({ from: '/_sidebar/collection/' }) as LoaderData;

  const renderCard = (item: CollectionGetDTO) => {
    return (
      <Card className="w-[325px] h-[275px] flex flex-col justify-between gap-0">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span className="font-[VT323] font-normal text-lg">
              {item.cigar?.brand?.name || "Unknown Brand"}
            </span>
            <Badge variant="outline" className="border-gray-500 font-[Sen] ml-2">
                {item.vitola?.length} x {item.vitola?.ring_gauge}
            </Badge>  
          </CardDescription>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <p className="my-2 font-[VT323] font-normal text-primary text-2xl/5">
              {item.cigar?.name || "Unknown Cigar"} {item.vitola?.name}
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="my-2 font-[Sen] text-white text-xs">
            black pepper, leather, earth, baking spices
          </p>
        </CardContent>
        <CardFooter>
          <div className="grid grid-cols-3 gap-2 w-full">
            <div className="flex flex-col items-center">
              <span className="font-[VT323] text-sm text-gray-500 uppercase">quantity</span>
              <span className="font-[VT323] font-normal text-2xl">{item.quantity}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-[VT323] text-sm text-gray-500 uppercase">rating</span>
              <span className="font-[VT323] font-normal text-2xl">{'N/A'}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-[VT323] text-sm text-gray-500 uppercase">stored for</span>
              <span className="font-[VT323] font-normal text-2xl">
                {getRelativeDateString(item.storage_date)}
                </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <Card className="w-[325px] h-[275px] flex flex-col justify-between bg-transparent border-gray-500">
          <CardHeader>
            <CardTitle>
              <span className="font-[VT323] font-normal text-xl">
                Add Cigars
              </span>
            </CardTitle>
            <CardDescription>
              Add new cigars to your collection
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
          </CardContent>
          <CardFooter className="flex items-end justify-between">
              <AddCollectionItemDialog
                brands={brands}
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