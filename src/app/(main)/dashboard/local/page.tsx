"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "./_components/data-table";
import { locationsResponseSchema } from "./_components/schema";

type LocationType = z.infer<typeof locationsResponseSchema>[number];

export default function Page() {
  const [data, setData] = useState<LocationType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
          credentials: "include",
        });

        const json = await res.json();
        const parsed = locationsResponseSchema.safeParse(json);

        if (parsed.success) {
          setData(parsed.data);
        } else {
          console.error("❌ Error validando datos", parsed.error);
        }
      } catch (error) {
        console.error("❌ Error en fetch", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Cargando ubicaciones...</p>;
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="@card-title leading-none font-semibold">Ubicaciones</div>
        <Button onClick={() => router.push("/dashboard/local/nuevo")}>Nueva ubicación</Button>
      </div>

      <DataTable data={data} />
    </div>
  );
}
