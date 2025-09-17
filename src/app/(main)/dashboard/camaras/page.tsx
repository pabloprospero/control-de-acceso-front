"use client";

import { useEffect, useState } from "react";

import { TableCards } from "./_components/table-cards";
import { CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/hooks/useAuth";
import CameraDialog from "./_components/camera-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface Camara {
  externalId: string;
  url: string;
  description?: string;
  locationExternalId: string;
  createdBy: string;
}

export default function Page() {
  const [camaras, setCamaras] = useState<Camara[]>([]);
  const { loading } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();

  const fetchCamaras = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cameras`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      setCamaras(data);
    } catch (error) {
      console.error("Error fetching camaras:", error);
    }
  };

  useEffect(() => {
    fetchCamaras();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <CardTitle>Cámaras</CardTitle>
        <Button style={{ marginBottom: "1rem" }} onClick={() => router.push("/dashboard/camaras/nuevo")}>
          Nueva Cámara
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:gap-6">
        <TableCards camaras={camaras} />
      </div>
    </div>
  );
}
