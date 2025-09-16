"use client";

import CameraDialog from "../../_components/camera-dialog";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditCameraPage() {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      router.push("/dashboard/camaras");
    }
  };

  return <CameraDialog open={open} onOpenChange={handleOpenChange} />;
}
