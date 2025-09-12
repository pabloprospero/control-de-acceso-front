"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Esquema de validación con Zod
const formSchema = z.object({
  externalId: z.string().min(1, "El externalId es requerido"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NuevaLocalPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      externalId: "",
      name: "",
      address: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    console.log("📨 Enviando datos:", data);

    try {
      const token = localStorage.getItem("token"); // 👈 Asegurate de guardar el JWT en login
      const userExternalId = localStorage.getItem("externalId");
      const res = await fetch("http://localhost:3000/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 autenticación JWT
        },
        body: JSON.stringify({
          ...data,
          createdBy: userExternalId, // 👈 lo envías al backend
        }),
      });

      if (!res.ok) throw new Error("Error en la API");

      const response = await res.json();
      console.log("✅ Respuesta:", response);

      toast.success("Datos guardados correctamente");
      form.reset();
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Hubo un problema al guardar los datos");
    }
  };

  return (
    <Form {...form}>
      <div className="@card-title leading-none font-semibold">Nueva Localización</div>
      <br />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="externalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External Id</FormLabel>
              <FormControl>
                <Input placeholder="externalId" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="nombre" {...field} />
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
                <Input placeholder="address" {...field} />
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
