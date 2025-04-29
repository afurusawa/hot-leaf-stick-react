"use client";

import { useState } from "react";
import { Link, Outlet, useLoaderData } from '@tanstack/react-router';
import {
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CigarGetDTO } from "@/features/cigars/cigar.types";
import type { BrandGetDTO } from "@/features/brands/brand.types";
import { CigarTableMeta, useCigarsTable } from "./useCigarsTable";
import { cigarQueryKeys } from "./useCigar";
import { getCigars } from "./cigar.api";
import { useQuery } from "@tanstack/react-query";
import { AddCigarDialog } from "./AddCigarDialog";


interface LoaderData {
  cigars: CigarGetDTO[];
  brands: BrandGetDTO[];
}

const columns: ColumnDef<CigarGetDTO>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="text-gray-500">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <a className="flex item-start gap-2 item-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="w-4" />
        </a>
      );
    },
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return (
        <div className="hover:underline">
          <Link to="/admin/cigars/$cigarId" params={{ cigarId: id }}>
            {row.getValue("name")}
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "brand_name",
    header: ({ column }) => {
      return (
        <a className="flex item-start gap-2 item-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Brand
          <ArrowUpDown className="w-4" />
        </a>
      );
    },
    cell: ({ row }) => {
      return <div className="font-medium">
        {row.getValue("brand_name") || "unknown"}
      </div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const cigar = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-gray-500">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={
                () => {
                  const meta = table.options.meta as CigarTableMeta;
                  return meta.onEdit(cigar);
                }
              }
            >
              Edit (WIP)
            </DropdownMenuItem>
            <DropdownMenuItem>Delete (WIP)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ManageCigars() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCigar, setSelectedCigar] = useState<CigarGetDTO | undefined>(undefined);

  const { cigars: initialCigars, brands } = useLoaderData({ from: '/admin/cigars/manage' }) as LoaderData;
  const { data: cigars } = useQuery({
    queryKey: cigarQueryKeys.cigars,
    queryFn: getCigars,
    initialData: initialCigars,
    staleTime: 0,
  });

  const table = useCigarsTable({
    cigars,
    columns,
    meta: {
      onEdit: (cigar: CigarGetDTO) => {
        setSelectedCigar(cigar);
        setIsDialogOpen(true);
      },
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter by cigar..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddCigarDialog
          brands={brands}
          cigars={cigars}
          cigar={selectedCigar}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setSelectedCigar(undefined);
          }}
          onSuccess={() => {
            setIsDialogOpen(false);
            setSelectedCigar(undefined);
          }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
