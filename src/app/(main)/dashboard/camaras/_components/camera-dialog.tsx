"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { usePathname } from "next/navigation";

type CameraDialogProps = {
  fetchData?: () => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CameraDialog({ fetchData, open, onOpenChange }: CameraDialogProps) {
  const pathname = usePathname();
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const match = pathname.match(/\/camaras\/edit\/(.+)$/);
    if (match) {
      setSelectedCamera(match[1]);
      onOpenChange(true);
    } else {
      setSelectedCamera(null);
    }
  }, [pathname, onOpenChange]);

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
    if (!selectedCamera || !open) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cameras/${selectedCamera}`, {
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
  }, [selectedCamera, open]);

  // Inicializar userExternalId para creación nueva
  useEffect(() => {
    if (selectedCamera) return;
    const user = localStorage.getItem("user");
    if (user) {
      setFormData((prev) => ({ ...prev, userExternalId: JSON.parse(user).externalId }));
    }
  }, [selectedCamera]);

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
      const url = selectedCamera
        ? `${process.env.NEXT_PUBLIC_API_URL}/cameras/${selectedCamera}`
        : `${process.env.NEXT_PUBLIC_API_URL}/cameras`;
      const method = selectedCamera ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al guardar cámara");

      toast.success(`Cámara ${selectedCamera ? "actualizada" : "creada"} con éxito`);
      (setFormData({
        name: "",
        description: "",
        url: "",
        locationExternalId: "",
        position: "",
        status: true,
        userExternalId: "",
      }),
        fetchData && fetchData());
      onOpenChange(false); // cerrar diálogo al guardar
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al guardar la cámara");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedCamera ? "Editar Cámara" : "Crear Cámara"}</DialogTitle>
        </DialogHeader>

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
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input id="url" name="url" value={formData.url} onChange={handleChange} required />
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
            <DialogFooter>
              <Button type="submit">{selectedCamera ? "Actualizar" : "Guardar"}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
