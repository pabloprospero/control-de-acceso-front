import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Video } from "lucide-react";
import z from "zod";
import { toast } from "sonner";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cameraSchema } from "./schema";
import { useRouter } from "next/navigation";

export const cameraColumns: ColumnDef<z.infer<typeof cameraSchema>>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
    cell: ({ row }) => <span>{row.original.name}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Descripción" />,
    cell: ({ row }) => <span>{row.original.description}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "url",
    header: ({ column }) => <DataTableColumnHeader column={column} title="URL" />,
    cell: ({ row }) => {
      const url = row.original.url;
      if (!url) return null;
      if (url.length <= 15) return url;

      const showLength = 15;
      const start = url.slice(0, showLength);
      const end = url.slice(-showLength + 5);

      return <span>{`${start}......${end}`}</span>;
    },
    enableHiding: false,
  },
  {
    accessorKey: "position",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Posición" />,
    cell: ({ row }) => <span>{row.original.position}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => <Badge variant="secondary">{row.original.status ? "Activo" : "Inactivo"}</Badge>,
    enableHiding: false,
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Creado por" />,
    cell: ({ row }) => <span>{`${row.original.creator.firstName} | ${row.original.creator.email}`}</span>,
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const handleEdit = () => {
        router.push(`/dashboard/camaras/edit/${row.original.externalId}`);
      };

      return (
        <div className="flex gap-2">
          <Button title="Editar" variant="ghost" size="icon" onClick={handleEdit}>
            <Edit />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Eliminar"
            onClick={() => {
              if (confirm(`¿Eliminar cámara "${row.original.name}"?`)) {
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/cameras/${row.original.externalId}`, {
                  method: "DELETE",
                  credentials: "include",
                })
                  .then(() => {
                    toast.success("Cámara eliminada");
                    window.location.reload();
                  })
                  .catch(() => toast.error("Error al eliminar"));
              }
            }}
          >
            <Trash2 />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Ver transmisión"
            onClick={() => {
              router.push(`camaras/${row.original.externalId}/stream?name=${encodeURIComponent(row.original.name)}`);
            }}
          >
            <Video />
          </Button>
        </div>
      );
    },

    header: () => <span>Acciones</span>,
  },
];
