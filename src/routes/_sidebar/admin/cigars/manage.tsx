import { createFileRoute } from '@tanstack/react-router';
import { queryClient } from "@/shared/lib/queryClient";
import { brandQueryKeys, getBrands } from '@/features/brands';
import { cigarQueryKeys, getCigars } from '@/features/cigars';
import { ManageCigars } from '@/features/cigars/ManageCigars';
import type { CigarGetDTO } from '@/features/cigars/cigar.types';
import type { BrandGetDTO } from '@/features/brands/brand.types';

interface LoaderData {
  cigars: CigarGetDTO[];
  brands: BrandGetDTO[];
}

export const Route = createFileRoute('/_sidebar/admin/cigars/manage')({
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