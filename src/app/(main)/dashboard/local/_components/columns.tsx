"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { locationsResponseSchema } from "./schema";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export type LocationType = z.infer<typeof locationsResponseSchema>[number];

export const dashboardColumns: ColumnDef<LocationType>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ getValue }) => {
      const value = getValue() as string | null | undefined;
      return value ?? "—";
    },
  },
  {
    accessorKey: "address",
    header: "Dirección",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const router = useRouter();

      const handleEdit = () => {
        // Cambia la URL incluyendo el externalId
        router.push(`/dashboard/local/edit/${row.original.externalId}`);
      };

      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (confirm(`¿Eliminar ubicación "${row.original.name}"?`)) {
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${row.original.externalId}`, {
                  method: "DELETE",
                  credentials: "include",
                })
                  .then(() => {
                    toast.success("Ubicación eliminada");
                    window.location.reload();
                  })
                  .catch(() => toast.error("Error al eliminar"));
              }
            }}
          >
            <Trash2 />
          </Button>
        </div>
      );
    },
    header: () => <span>Acciones</span>,
  },
];
