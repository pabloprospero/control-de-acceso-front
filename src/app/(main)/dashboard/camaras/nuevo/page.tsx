"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, Eye, ImagePlay, VideoOff, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// interface CameraFormPageProps {
//   cameraId?: string;
// }

export default function CameraFormPage({ cameraId }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    locationExternalId: "",
    position: "",
    status: true,
    userExternalId: "",
  });

  const [locations, setLocations] = useState<{ externalId: string; name: string }[]>([]);

  // Fetch de ubicaciones
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setLocations);
  }, []);

  // Fetch de cámara a editar
  useEffect(() => {
    if (!cameraId) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cameras/${cameraId}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) =>
        setFormData({
          name: data.name ?? "",
          description: data.description ?? "",
          url: data.url ?? "",
          locationExternalId: data.locationExternalId ?? "",
          position: data.position ?? "",
          status: data.status ?? true,
          userExternalId: data.userExternalId ?? "",
        }),
      )
      .finally(() => setLoading(false));
  }, [cameraId]);

  // Inicializar userExternalId para creación nueva
  useEffect(() => {
    if (cameraId) return;
    const user = localStorage.getItem("user");
    if (user) {
      setFormData((prev) => ({ ...prev, userExternalId: JSON.parse(user).externalId }));
    }
  }, [cameraId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: boolean) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = cameraId
        ? `${process.env.NEXT_PUBLIC_API_URL}/cameras/${cameraId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/cameras`;
      const method = cameraId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar cámara");

      toast.success(`Cámara ${cameraId ? "actualizada" : "creada"} con éxito`);
      setFormData({
        name: "",
        description: "",
        url: "",
        locationExternalId: "",
        position: "",
        status: true,
        userExternalId: "",
      });
      router.push("/dashboard/camaras");
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al guardar la cámara");
    }
  };

  const [preview, setPreview] = useState("");

  const handlePreview = async () => {
    if (!formData.url) {
      toast.error("Debes ingresar una URL para previsualizar");
      return;
    }

    const loadingToast = toast.loading("Conectando a la cámara...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cameras/frame`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url: formData.url }),
      });

      if (!res.ok) throw new Error("Error al obtener la vista previa");

      const blob = await res.blob();
      setPreview(URL.createObjectURL(blob));

      toast.success("Vista previa generada", { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar la vista previa", { id: loadingToast });
    }
  };

  return (
    <div style={{ display: "flex", gap: "6rem" }}>
      <div style={{ width: "50%" }}>
        <div>
          <div className="@card-title leading-none font-semibold">{cameraId ? "Editar cámara" : "Nueva cámara"}</div>
          <br />
        </div>

        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <div className="grid gap-2" style={{ display: "flex", paddingTop: "0.5rem" }}>
                <Input id="url" name="url" value={formData.url} onChange={handleChange} required />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={(e) => {
                          handlePreview();
                        }}
                      >
                        <ImagePlay />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Vista previa</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="position">Posición</Label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="rounded-md border p-2"
              >
                <option value="">Selecciona posición</option>
                <option value="entry">Entrada</option>
                <option value="exit">Salida</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Estado:</span>
              <Toggle pressed={formData.status} onPressedChange={handleStatusChange} variant="outline">
                {formData.status ? (
                  <>
                    <Check className="size-4" /> Activa
                  </>
                ) : (
                  <>
                    <X className="size-4" /> Inactiva
                  </>
                )}
              </Toggle>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="locationExternalId">Ubicación</Label>
              <select
                id="locationExternalId"
                name="locationExternalId"
                value={formData.locationExternalId}
                onChange={handleChange}
                required
                className="rounded-md border p-2"
              >
                <option value="">Selecciona ubicación</option>
                {locations.map((loc) => (
                  <option key={loc.externalId} value={loc.externalId}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button type="submit">Guardar</Button>
              <Button variant="secondary" type="button" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </div>
      <div style={{ width: "100%" }}>
        <div className="@card-title leading-none font-semibold">Vista previa</div>
        <div
          style={{
            marginTop: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e0dedeff",
            color: "#000000ff",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Vista previa cámara"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <VideoOff />
              <span>Sin vista previa</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
