import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

const flowerSchema = z.object({
  number: z.number().min(1).max(38),
  name_english: z
    .string()
    .min(2, "Name (EN) muss mindestens 2 Zeichen lang sein"),
  name_german: z
    .string()
    .min(2, "Name (DE) muss mindestens 2 Zeichen lang sein"),
  name_latin: z.string().optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Ungültiger Farbcode"),
  description: z.string().optional(),
  affirmation: z.string().optional(),
});

type FlowerFormValues = z.infer<typeof flowerSchema>;

interface FlowerFormDialogProps {
  flower?: BachFlower;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function FlowerFormDialog({
  flower,
  onSuccess,
  trigger,
}: FlowerFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FlowerFormValues>({
    resolver: zodResolver(flowerSchema),
    defaultValues: {
      number: flower?.number ?? 0,
      name_english: flower?.name_english ?? "",
      name_german: flower?.name_german ?? "",
      name_latin: flower?.name_latin ?? "",
      color: flower?.color ?? "#000000",
      description: flower?.description ?? "",
      affirmation: flower?.affirmation ?? "",
    },
  });

  const onSubmit = async (data: FlowerFormValues) => {
    try {
      setIsLoading(true);

      if (flower?.id) {
        const { error } = await supabase
          .from("bach_flowers")
          .update(data)
          .eq("id", flower.id);

        if (error) throw error;
        toast.success("Bachblüte erfolgreich aktualisiert");
      } else {
        const { error } = await supabase.from("bach_flowers").insert([data]);

        if (error) throw error;
        toast.success("Bachblüte erfolgreich angelegt");
      }

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast.error(
        flower?.id
          ? "Fehler beim Aktualisieren der Bachblüte"
          : "Fehler beim Anlegen der Bachblüte",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Neue Bachblüte
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {flower?.id ? "Bachblüte bearbeiten" : "Neue Bachblüte"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nummer</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={38}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_english"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (EN)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_german"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (DE)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_latin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lateinischer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farbe</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" className="w-12" {...field} />
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Abbrechen
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    <span>Speichern...</span>
                  </div>
                ) : (
                  "Speichern"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
