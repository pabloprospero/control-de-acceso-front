"use client";

import { Download } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";

import { z } from "zod";
import { recentLeadSchema } from "./schema";
import { recentLeadsColumns } from "./columns.crm";
import { Camara } from "../page";

type RecentLead = z.infer<typeof recentLeadSchema>;

type TableCardsProps = {
  camaras: Camara[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TableCards(props: { camaras?: any }) {
  const table = useDataTableInstance({
    data: props.camaras,
    columns: recentLeadsColumns, // 👈 usar columnas
  });

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardAction>
            <div className="flex items-center gap-2">
              <DataTableViewOptions table={table} />
              {/* <Button variant="outline" size="sm">
                <Download />
                <span className="hidden lg:inline">Export</span>
              </Button> */}
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            <DataTable table={table} columns={recentLeadsColumns} /> {/* 👈 columnas correctas */}
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
