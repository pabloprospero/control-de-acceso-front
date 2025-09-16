"use client";

import { Download } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { z } from "zod";
import { cameraSchema } from "./schema";
import { cameraColumns } from "./columns.crm";
import { Camara } from "../page";

type Camera = z.infer<typeof cameraSchema>;

type TableCardsProps = {
  camaras: Camara[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TableCards(props: { camaras?: any }) {
  const table = useDataTableInstance({
    data: props.camaras,
    columns: cameraColumns,
  });

  function handleEdit(id: string): void {
    throw new Error("Function not implemented.");
  }

  function handleDelete(id: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={cameraColumns} />
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
