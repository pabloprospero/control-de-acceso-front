"use client";

import { useEffect, useState } from "react";

import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";

export default function CreateCameraDialog() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    locationId: "",
    position: "",
    status: true,
    userExternalId: "",
  });

  const [authToken, setAuthToken] = useState<string | string>("");

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    // setAuthToken(token);
    setAuthToken(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHRlcm5hbElkIjoiYzcyMDc0NTUtMmZkMC00ZjliLTgxNjYtYzAxZGRkOGZiOTQyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzU3Njk0MTQ3LCJleHAiOjE3NTc3MjI5NDd9.EfAn1SVsVaJHdM1-8u8GTOVaXXlPpmLAx2ZThwSCPrE",
    );
    const externalId = localStorage.getItem("externalId") ?? "";
    setFormData((prev) => ({ ...prev, userExternalId: externalId }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // aquí deberías llamar a tu API
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cameras`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al crear cámara");
      alert("Cámara creada con éxito ✅");
      setFormData({
        name: "",
        description: "",
        url: "",
        locationId: "",
        position: "entry",
        status: true,
        userExternalId: authToken,
      });
    } catch (error) {
      console.error(error);
      alert("Hubo un error al crear la cámara ❌");
    }
  };

  const handleStatusChange = (value: boolean) => {
    setFormData({ ...formData, status: value });
  };

  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (!authToken) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken,
      },
    })
      .then((res) => res.json())
      .then((data) => setLocations(data));
  }, [authToken]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Nueva Cámara</Button>
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
            <Label htmlFor="locationId">Ubicación</Label>
            <select
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              required
              className="rounded-md border p-2"
            >
              <option value="">Selecciona ubicación</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
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
