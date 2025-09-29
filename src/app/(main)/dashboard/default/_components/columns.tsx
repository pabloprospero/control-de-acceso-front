import { ColumnDef } from "@tanstack/react-table";
import { CircleCheck, Loader, EllipsisVertical } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { DataTableColumnHeader } from "../../../../../components/data-table/data-table-column-header";

import { eventsResponseSchema } from "./schema";

export const dashboardColumns: ColumnDef<any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: "documentType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo Doc." />,
  },
  {
    accessorKey: "documentNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nro Documento" />,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Apellido" />,
  },
  {
    accessorKey: "type",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5 capitalize">
        {row.original.type === "entry" ? "Ingreso" : "Egreso"}
      </Badge>
    ),
  },
  {
    accessorKey: "photoPath",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Foto" />,
    cell: ({ row }) => {
      const photo = row.original.photoPath
        ? "https://acces-control.duckdns.org/detected/" + row.original.photoPath.split("/").pop()
        : null;

      return (
        <div className="flex h-16 w-16 items-center justify-center">
          {photo ? (
            <Dialog>
              <DialogTrigger asChild>
                <img
                  src={photo}
                  alt="Foto"
                  className="h-full w-full cursor-pointer rounded-md object-cover hover:opacity-80"
                />
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogTitle>Vista previa</DialogTitle>
                <img src={photo} alt="Foto grande" className="h-auto w-full rounded-lg object-contain" />
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-gray-400">Sin foto</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
    cell: ({ row }) => {
      const fecha = new Date(row.original.createdAt).toLocaleString();
      return (
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {fecha}
        </Badge>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: () => (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
  //           <EllipsisVertical />
  //           <span className="sr-only">Acción</span>
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="end" className="w-32">
  //         <DropdownMenuItem>Editar</DropdownMenuItem>
  //         <DropdownMenuItem>Ver</DropdownMenuItem>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   ),
  //   enableSorting: false,
  // },
];
