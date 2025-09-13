"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";

// Esquema de validación con Zod
const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  description: z.string().min(5, "La descripción debe tener al menos 5 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NuevaLocalPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          userExternalId: JSON.parse(user ?? "").externalId,
        }),
      });

      if (!res.ok) throw new Error("Error en la API");

      const response = await res.json();
      toast.success("Datos guardados correctamente");
      form.reset();
    } catch (error) {
      toast.error("Hubo un problema al guardar los datos");
    }
  };

  return (
    <Form {...form}>
      <div className="@card-title leading-none font-semibold">Nueva ubicación</div>
      <br />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button className="w-full" type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  );
}
