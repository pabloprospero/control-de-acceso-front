"use client";

import { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { locationsResponseSchema } from "./schema";

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
];
