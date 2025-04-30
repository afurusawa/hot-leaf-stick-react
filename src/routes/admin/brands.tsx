import { createFileRoute } from '@tanstack/react-router';
import { queryClient } from "@/shared/lib/queryClient";
import { brandQueryKeys, getBrands } from "@/features/brands";
import { LoaderData, ManageBrands } from '@/features/brands/ManageBrands';

export const Route = createFileRoute('/admin/brands')({
  component: ManageBrands,
  loader: async () => {
    const brands = await queryClient.ensureQueryData({
      queryKey: brandQueryKeys.brands,
      queryFn: getBrands,
    });
    return { brands } as LoaderData;
  },
});