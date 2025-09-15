"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { DataTable } from "./_components/data-table";
import { eventsResponseSchema, eventSchema } from "./_components/schema";
import { useAuth } from "@/app/hooks/useAuth";

type EventType = z.infer<typeof eventSchema>;

export default function Page() {
  const [data, setData] = useState<EventType[]>([]);

  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
          credentials: "include",
        });

        const json = await res.json();
        console.log("👉 JSON recibido:", json);

        const parsed = eventsResponseSchema.safeParse(json);

        if (parsed.success) {
          setData(parsed.data.events);
        } else {
          console.error("❌ Error validando datos", parsed.error);
        }
      } catch (error) {
        console.error("❌ Error en fetch", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const { loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (loadingEvents) {
    return <p className="text-gray-500">Cargando eventos...</p>;
  }

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <DataTable data={data} />
    </div>
  );
}
