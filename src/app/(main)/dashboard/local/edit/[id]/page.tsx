"use client";

import { useEffect, useState } from "react";
import LocationFormPage from "../../nuevo/page";
import { usePathname } from "next/navigation";

export default function LocationPage() {
  const pathname = usePathname();
  const [locationId, setLocationId] = useState<string | null>(null);

  useEffect(() => {
    const id = pathname.split("/").pop();
    if (id) setLocationId(id);
  }, [pathname]);

  if (!locationId) return <div>ID de ubicación no proporcionado</div>;

  return <LocationFormPage id={locationId}></LocationFormPage>;
}
