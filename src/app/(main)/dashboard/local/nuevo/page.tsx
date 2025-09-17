"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

// Esquema de validación con Zod
const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

interface LocationFormPageProps {
  id?: string;
}

export default function LocationFormPage(props: LocationFormPageProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (!props.id) return;

    // Fetch de datos de la ubicación
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations/${props.id}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        form.reset({
          name: data.name,
          address: data.address,
          description: data.description,
        });
      })
      .catch(() => toast.error("Error al cargar los datos de la ubicación"));
  }, [props.id]);

  const onSubmit = async (data: FormValues) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        toast.error("Usuario no encontrado en localStorage");
        return;
      }

      const { externalId: userExternalId } = JSON.parse(user);

      const url = props.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/locations/${props.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/locations`;

      const method = props.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, userExternalId }),
      });

      if (!res.ok) throw new Error("Error en la API");

      toast.success(`Ubicación ${props.id ? "actualizada" : "creada"} correctamente`);
      form.reset();
      router.push("/dashboard/local");
    } catch (error) {
      toast.error("Hubo un problema al guardar los datos");
    }
  };

  return (
    <Form {...form}>
      <div className="@card-title leading-none font-semibold">{props.id ? "Editar ubicación" : "Nueva ubicación"}</div>
      <br />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" style={{ maxWidth: "400px" }}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Oficina Central" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Calle 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Oficina Central" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="submit">Guardar</Button>
          <Button variant="secondary" type="button" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
