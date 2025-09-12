"use client";

import { useEffect, useState } from "react";

import { Dialog } from "@/components/ui/dialog";

import CreateCameraDialog from "./_components/camera-dialog";
import { TableCards } from "./_components/table-cards";

interface Camara {
  externalId: string;
  url: string;
  description?: string;
  locationExternalId: string;
  createdBy: string;
}

export default function Page() {
  const [camaras, setCamaras] = useState<Camara[]>([]);
  const [authToken, setAuthToken] = useState<string | string>("");

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    setAuthToken(token);
  }, []);

  useEffect(() => {
    if (!authToken) return;
    const fetchCamaras = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cameras`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
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

    fetchCamaras();
  }, [authToken]);

  return (
    <div>
      <CreateCameraDialog />
      <div className="flex flex-col gap-4 md:gap-6">
        <TableCards camaras={camaras} />
      </div>
    </div>
  );
}
