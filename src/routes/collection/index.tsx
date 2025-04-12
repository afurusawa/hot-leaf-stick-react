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
import { collectionQueryKeys, getCollection } from "@/features/collection/collectionApi";
import { Cigar } from "@/features/collection/collectionApi";
import { Key } from "react";

const data = [
  {
    name: "Gas Station Sushi",
    owner: "Sanj Patel",
    size: "7.5x58 Salomon",
    flavors: ["graham cracker", "dates", "ginger spice"],
    qty: 23,
    price: 3.20,
    rating: 10,
  },
  {
    name: "Undercrown 10",
    owner: "Drew Estate",
    size: "6x50 Toro",
    flavors: ["graham cracker", "dates", "ginger spice"],
    qty: 23,
    price: 3.20,
  },
  {
    name: "Charter Oak Connecticut Broadleaf Maduro",
    owner: "Foundation Cigars",
    size: "6x50 Toro",
    flavors: ["graham cracker", "dates", "ginger spice"],
    qty: 23,
    price: 3.20,
  }
];

interface LoaderData {
  collections: Cigar[];
}

export const Route = createFileRoute("/collection/")({
  component: Collection,
  loader: async () => {
    const collection = await queryClient.ensureQueryData({
      queryKey: collectionQueryKeys.all,
      queryFn: getCollection,
    });
    return { collection };
  },
});

function Collection() {
  const { collection } = useLoaderData({ from: '/collection/' }) as LoaderData;

  const renderCard = (cigar: Cigar) => {

    // const renderBadge = (flavor: string) => {
    //   return (
    //     <Badge className="m-0" variant="outline">
    //       {flavor}
    //     </Badge>
    //   );
    // }

    return (
      <div className="w-[300px] m-4">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <p>{cigar.name}</p>
              <Badge className="ml-2">
                0x0
              </Badge>
            </CardTitle>
            <CardDescription>{cigar.brand}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* <div className="flex flex-wrap justify-start">
              {item.flavors.map((flavor: string) => (
                <div key={flavor}>
                  {renderBadge(flavor)}
                </div>
              ))}
            </div> */}
            {/* <p>Qty: {item.qty}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <p>Rating {item.rating}</p> */}
          </CardContent>
          <CardFooter className="flex items-center justify-between w-full">
            {/* Create a view and smoke button on the same line. buttons are both width 50% of the full container width */}
            <Button variant="outline" size="lg" className="w-1/2">
              Edit
            </Button>
            <Button variant="outline" size="lg" className="w-1/2">
              Smoke
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full items-center">
      <div className="w-[300px] m-4">

        <Card className="w-full h-full bg-primary text-primary-foreground flex flex-col justify-between">
          {/* I want this to be a big add button with a plus icon */}
          <CardHeader>
            <CardTitle className="flex items-start justify-between">
              <h1>Add Experience</h1>
            </CardTitle>
            <CardDescription>
              Add a new cigar to your collection
            </CardDescription>
          </CardHeader>
          <CardContent>

          </CardContent>
          <CardFooter className="flex items-end justify-between">
            <Button variant="secondary" size="lg" className="w-full">
              <Link to="/collection/addCigar">Add</Link>
            </Button>
          </CardFooter>
        </Card>

      </div>
      {collection.map((item: Cigar[], index: Key | null | undefined) => (
        <div key={index}>
          {renderCard(item)}
        </div>
      ))}
    </div>
  );
}