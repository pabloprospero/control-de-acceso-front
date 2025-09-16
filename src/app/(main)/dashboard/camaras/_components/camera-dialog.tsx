"use client";

import { useEffect, useState } from "react";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

type CreateCameraDialogProps = {
  fetchData: () => Promise<void>; // o ajustalo según lo que devuelva tu función
};

export default function CreateCameraDialog({ fetchData }: CreateCameraDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    locationExternalId: "",
    position: "",
    status: true,
    userExternalId: "",
  });

  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    setAuthToken(token);
    const user = localStorage.getItem("user") ?? "";
    setFormData((prev) => ({ ...prev, userExternalId: JSON.parse(user).externalId }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // aquí deberías llamar a tu API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cameras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al crear cámara");
      alert("Cámara creada con éxito");
      setFormData({
        name: "",
        description: "",
        url: "",
        locationExternalId: "",
        position: "entry",
        status: true,
        userExternalId: "",
      });
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear la cámara");
    }
  };

  const handleStatusChange = (value: boolean) => {
    setFormData({ ...formData, status: value });
  };

  const [locations, setLocations] = useState<{ externalId: string; name: string }[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setLocations(data));
  }, [authToken]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button style={{ marginBottom: "1rem" }}>Nueva Cámara</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Cámara</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ej. Cámara principal"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              placeholder="Ej. Cámara principal"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" placeholder="rtsp://..." value={formData.url} onChange={handleChange} required />
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
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
