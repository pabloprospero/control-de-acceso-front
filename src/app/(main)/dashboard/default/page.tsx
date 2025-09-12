"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { DataTable } from "./_components/data-table";
import { eventsResponseSchema, eventSchema } from "./_components/schema";

type EventType = z.infer<typeof eventSchema>;

export default function Page() {
  const [data, setData] = useState<EventType[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token"); // o de donde lo guardes después del login

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        console.log("👉 JSON recibido:", json);

        const parsed = eventsResponseSchema.safeParse(json);

        if (parsed.success) {
          // ahora los eventos están en parsed.data.events
          setData(parsed.data.events);
        } else {
          console.error("❌ Error validando datos", parsed.error);
        }
      } catch (error) {
        console.error("❌ Error en fetch", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Cargando eventos...</p>;
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <DataTable data={data} />
    </div>
  );
}
