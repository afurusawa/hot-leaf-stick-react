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
import type { CigarGetDTO } from "./cigar";

// Define custom TableMeta interface for Brand
export interface CigarTableMeta extends TableMeta<CigarGetDTO> {
  onEdit: (cigar: CigarGetDTO) => void
}

interface UseCigarsTableProps {
  cigars: CigarGetDTO[];
  columns: ColumnDef<CigarGetDTO>[];
  meta?: CigarTableMeta;
}

export function useCigarsTable({ cigars, columns }: UseCigarsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: cigars,
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