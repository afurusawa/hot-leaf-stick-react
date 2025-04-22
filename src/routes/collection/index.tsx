import { Key } from "react";
import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { queryClient } from "@/shared/lib/queryClient";
import { cigarQueryKeys, collectionQueryKeys, getBrands, getCollection } from "@/features/collection/collectionApi";
import { Brand, CollectionItem } from "@/features/collection/collectionItem";
import { capitalize, getRelativeDateString } from "@/shared/lib/utils";


interface LoaderData {
  entries: CollectionItem[];
  brands: Brand[];
}

export const Route = createFileRoute("/collection/")({
  component: Collection,
  loader: async () => {
    const entries = await queryClient.ensureQueryData({
      queryKey: collectionQueryKeys.all,
      queryFn: getCollection,
    });

    // I want to get all the brand names
    const brands = await queryClient.ensureQueryData({
      queryKey: cigarQueryKeys.brands,
      queryFn: getBrands,
    });

    return { entries, brands };
  },
});

function Collection() {
  const { entries, brands } = useLoaderData({ from: '/collection/' }) as LoaderData;

  const renderCard = (entry: CollectionItem) => {

    const brandName = brands.find((brand) => brand.id === entry.brandId)?.name;

    return (
      <Card className="w-[300px] h-[250px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            {capitalize(`${entry.cigar?.name || entry.custom?.cigarName} ${entry.custom?.vitola.name}`)}
          </CardTitle>
          <CardDescription>
            {brandName || entry.custom?.brandName}
            <Badge variant="outline" className="ml-4">
              {entry.custom?.vitola.length}x{entry.custom?.vitola.ringGauge}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Qty: {entry.quantity}</p>
          <p>Stored {getRelativeDateString(entry.storageDate)}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between w-full">
          <Button variant="outline" size="lg" className="w-full">
            See Details
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
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
          <Link to="/collection/addCigar" className="w-full">
            <Button variant="default" size="lg" className="w-full">
              Add
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {entries.map((entry: CollectionItem, index: Key | null | undefined) => (
        <div key={index}>
          {renderCard(entry)}
        </div>
      ))}
    </div>
  );
}