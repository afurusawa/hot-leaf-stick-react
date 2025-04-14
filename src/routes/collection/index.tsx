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
import { queryClient } from "@/lib/queryClient";
import { cigarQueryKeys, collectionQueryKeys, getBrands, getCollection } from "@/features/collection/collectionApi";
import { Brand, CollectionEntry } from "@/features/collection/collectionEntry";
import { capitalize, getRelativeDateString } from "@/lib/utils";

interface LoaderData {
  entries: CollectionEntry[];
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

  const renderCard = (entry: CollectionEntry) => {

    const brandName = brands.find((brand) => brand.id === entry.cigar.brandId)?.name;

    return (
      <Card className="w-[300px] h-[250px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="flex items-start justify-between">
            <p>{capitalize(`${entry.cigar.name} ${entry.vitola.name}`)}</p>
            <Badge className="ml-2">
              {entry.vitola.length}x{entry.vitola.ringGauge}
            </Badge>
          </CardTitle>
          <CardDescription>
            {capitalize(brandName || "")}
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
      <Card className="w-[300px] h-[250px] flex flex-col justify-between">
        <CardHeader>
          <CardTitle>
            <h1>Add Cigars</h1>
          </CardTitle>
          <CardDescription>
            Add new cigars to your collection
          </CardDescription>
        </CardHeader>
        <CardContent>

        </CardContent>
        <CardFooter className="flex items-end justify-between">
          <Link to="/collection/addCigar" className="w-full">
            <Button variant="secondary" size="lg" className="w-full">
              Add
            </Button>
          </Link>
        </CardFooter>
      </Card>

      {entries.map((entry: CollectionEntry, index: Key | null | undefined) => (
        <div key={index}>
          {renderCard(entry)}
        </div>
      ))}
    </div>
  );
}