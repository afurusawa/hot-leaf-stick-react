import { createFileRoute } from '@tanstack/react-router';
import { queryClient } from "@/shared/lib/queryClient";
import { brandQueryKeys, getBrands } from '@/features/brands';
import { cigarQueryKeys, getCigars } from '@/features/cigars';
import { ManageCigars } from '@/features/cigars/ManageCigars';

import type { Cigar } from "@/features/cigars/cigar";
import type { BrandGetDTO } from "@/features/brands/brand";

interface LoaderData {
  cigars: Cigar[];
  brands: BrandGetDTO[];
}

export const Route = createFileRoute('/admin/cigars/manage')({
  component: ManageCigars,
  loader: async () => {
    const brands = await queryClient.ensureQueryData({
      queryKey: brandQueryKeys.brands,
      queryFn: getBrands,
    });

    const cigars = await queryClient.ensureQueryData({
      queryKey: cigarQueryKeys.cigars,
      queryFn: getCigars,
    });

    return { brands, cigars } as LoaderData;
  }
});