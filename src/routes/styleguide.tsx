import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/styleguide')({
  component: StyleGuide,
});

function StyleGuide() {
  return <div> 
    <h1>Styleguide</h1>
    <h2>Typography</h2>
    <p>This is a styleguide page.</p>

<div className="p-6">
    <h1 className="my-6 font-[Gugi] text-5xl text-primary">HOT LEAF STICK</h1>
    <h2 className="my-2 font-[Contrail_One] text-4xl tracking-wide">Aladino Corojo Reserva</h2>
    <p className="my-4 font-[Spectral] text-lg">
    The Aladino Corojo is made in Honduras using higher priming Honduran Corojo tobacco for the wrapper, filler, and binder. Aladino Corojo has notes earth, leather, and pepper spice. Medium to Full in body, it will be great choice for aficionados that enjoy Rocky Patel Edge Corojo, Perdomo Sun Grown, or My Father cigars.
    </p>
    <Button className="bg-primary text-white uppercase font-[Share_Tech_Mono] tracking-wide">Click me</Button>
</div>

<div className="p-6">
    <h1 className="my-6 font-[DM_Serif_Display] font-bold text-5xl text-primary">HOT LEAF STICK</h1>
    <h2 className="my-2 font-[DM_Serif_Display] text-4xl tracking-wide">Aladino Corojo Reserva</h2>
    <p className="my-4 font-[Sen] text-lg">
    The Aladino Corojo is made in Honduras using higher priming Honduran Corojo tobacco for the wrapper, filler, and binder. Aladino Corojo has notes earth, leather, and pepper spice. Medium to Full in body, it will be great choice for aficionados that enjoy Rocky Patel Edge Corojo, Perdomo Sun Grown, or My Father cigars.
    </p>
    <Button className="bg-primary text-white uppercase font-[Sen]">Click me</Button>
</div>


<div className="p-6">
    <h1 className="my-6 font-[VT323] text-5xl font-bold text-primary tracking-wide">HOT LEAF STICK</h1>
    <h2 className="my-2 font-[Contrail_One] uppercase text-4xl">Aladino Corojo Reserva</h2>
    <p className="my-4 font-[VT323] text-lg">
    The Aladino Corojo is made in Honduras using higher priming Honduran Corojo tobacco for the wrapper, filler, and binder. Aladino Corojo has notes earth, leather, and pepper spice. Medium to Full in body, it will be great choice for aficionados that enjoy Rocky Patel Edge Corojo, Perdomo Sun Grown, or My Father cigars.
    </p>
    <Button className="bg-primary text-white uppercase font-[VT323] text-xl tracking-wide">Click me</Button>
</div>

    <Input />
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
    </Select>
  </div>;
}
