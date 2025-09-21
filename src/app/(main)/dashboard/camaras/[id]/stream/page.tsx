"use client";

import { useParams, useSearchParams } from "next/navigation";

export default function CamaraStreamPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const cameraId = params.id;
  const name = searchParams.get("name");

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Stream cámara: {name || cameraId}</h2>
      <img
        src={`${process.env.NEXT_PUBLIC_WORKER_URL ?? "http://34.29.121.159:5000"}/stream/${cameraId}`}
        alt={`Stream de ${name || cameraId}`}
        style={{ width: "80%", maxWidth: 800, border: "1px solid #ccc" }}
      />
    </div>
  );
}
