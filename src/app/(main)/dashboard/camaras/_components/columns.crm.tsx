import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const recentLeadsColumns: ColumnDef<z.infer<typeof recentLeadSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ref" />,
    cell: ({ row }) => <span className="tabular-nums">{row.original.externalId}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Descripción",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
    cell: ({ row }) => <span>{row.original.description}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "Ubicación",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ubicación" />,
    cell: ({ row }) => <span>{row.original.locationExternalId}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "Creado por",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Creado por" />,
    cell: ({ row }) => <Badge variant="secondary">{row.original.createdBy}</Badge>,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" className="text-muted-foreground flex size-8" size="icon">
        <EllipsisVertical />
        <span className="sr-only">Open menu</span>
      </Button>
    ),
    enableSorting: false,
  },
];
