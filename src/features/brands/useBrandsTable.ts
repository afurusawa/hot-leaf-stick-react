import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  TableMeta,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { BrandGetDTO } from "./brand.types";

// Define custom TableMeta interface for Brand
export interface BrandTableMeta extends TableMeta<BrandGetDTO> {
  onEditBrand: (brand: BrandGetDTO) => void
}

interface UseBrandsTableProps {
  brands: BrandGetDTO[];
  columns: ColumnDef<BrandGetDTO>[];
  meta?: BrandTableMeta;
}

export function useBrandsTable({ brands, columns }: UseBrandsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: brands,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    }
  });

  return {
    ...table,
    flexRender,
  };
}