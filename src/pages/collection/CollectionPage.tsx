import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"


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

export default function CollectionPage() {

  const renderCard = (item: any) => {

    const renderBadge = (flavor: string) => {
      return (
        <Badge className="m-0" variant="outline">
          {flavor}
        </Badge>
      );
    }

    return (
      <div className="w-[300px] m-4">
        <AspectRatio ratio={1 / 1}>
          <Card className="w-full h-full">
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <p>{item.name}</p>
                <Badge className="ml-2">
                  {item.size}
                </Badge>
              </CardTitle>
              <CardDescription>{item.owner}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-start">
                {item.flavors.map((flavor: string) => (
                  <div key={flavor}>
                    {renderBadge(flavor)}
                  </div>
                ))}
              </div>
              <p>Qty: {item.qty}</p>
              <p>Price: ${item.price.toFixed(2)}</p>
              <p>Rating {item.rating}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between w-full">
              {/* Create a view and smoke button on the same line. buttons are both width 50% of the full container width */}
              <Button variant="outline" size="lg" className="w-1/2">
                View
              </Button>
              <Button variant="outline" size="lg" className="w-1/2">
                Smoke
              </Button>
            </CardFooter>
          </Card>
        </AspectRatio>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full items-center">
      <div className="w-[300px] m-4">
        <AspectRatio ratio={1 / 1}>
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
                Add
              </Button>
            </CardFooter>
          </Card>
        </AspectRatio>
      </div>
      {data.map((item, index) => (
        <div key={index}>
          {renderCard(item)}
        </div>
      ))}
      <Button>Add</Button>
    </div>
  );
}