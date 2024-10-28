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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

// Schema für die Formularvalidierung
const clientSchema = z.object({
  first_name: z.string().min(2, "Vorname muss mindestens 2 Zeichen lang sein"),
  last_name: z.string().min(2, "Nachname muss mindestens 2 Zeichen lang sein"),
  email: z
    .string()
    .email("Ungültige E-Mail-Adresse")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  street: z.string().min(2, "Straße ist erforderlich"),
  house_number: z.string().min(1, "Hausnummer ist erforderlich"),
  postal_code: z.string().min(4, "PLZ muss mindestens 4 Zeichen lang sein"),
  city: z.string().min(2, "Stadt ist erforderlich"),
  country: z.enum(["DE", "AT"], {
    required_error: "Land ist erforderlich",
  }),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormDialogProps {
  client?: ClientFormValues & { id: string };
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ClientFormDialog({
  client,
  onSuccess,
  trigger,
}: ClientFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [cities, setCities] = useState<
    Array<{ city: string; postal_code: string }>
  >([]);
  const { user } = useAuth();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      first_name: client?.first_name ?? "",
      last_name: client?.last_name ?? "",
      email: client?.email ?? "",
      phone: client?.phone ?? "",
      street: client?.street ?? "",
      house_number: client?.house_number ?? "",
      postal_code: client?.postal_code ?? "",
      city: client?.city ?? "",
      country: client?.country ?? "AT",
    },
  });

  // Fetch cities based on postal code
  const fetchCities = async (postalCode: string, country: string) => {
    setIsLoadingCities(true);
    try {
      // In einer realen Anwendung würden Sie hier einen Geocoding-Service verwenden
      // Beispiel mit OpenStreetMap Nominatim API (für Produktivumgebung ungeeignet)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?country=${country}&postalcode=${postalCode}&format=json`,
      );
      const data = await response.json();

      const uniqueCities = Array.from(
        new Set(
          data.map((item: any) => ({
            city:
              item.address.city || item.address.town || item.address.village,
            postal_code: item.address.postcode,
          })),
        ),
      );

      setCities(uniqueCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setIsLoadingCities(false);
    }
  };

  // Handle postal code change
  const handlePostalCodeChange = (value: string) => {
    form.setValue("postal_code", value);
    if (value.length >= 4) {
      const country = form.getValues("country");
      fetchCities(value, country);
    }
  };

  const onSubmit = async (data: ClientFormValues) => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Bereite die Adressdaten für die Datenbank vor
      const clientData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        street: data.street,
        house_number: data.house_number,
        postal_code: data.postal_code,
        city: data.city,
        country: data.country,
        // address wird automatisch generiert, also nicht mit senden
      };

      if (client?.id) {
        // Update existing client
        const { error } = await supabase
          .from("clients")
          .update(clientData)
          .eq("id", client.id);

        if (error) throw error;
        toast.success("Klient erfolgreich aktualisiert");
      } else {
        // Create new client
        const { error } = await supabase.from("clients").insert({
          ...clientData,
          therapist_id: user.id,
        });

        if (error) throw error;
        toast.success("Klient erfolgreich angelegt");
      }

      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error saving client:", error);
      toast.error(
        client?.id
          ? "Fehler beim Aktualisieren des Klienten"
          : "Fehler beim Anlegen des Klienten",
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
            Neuer Klient
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {client?.id ? "Klient bearbeiten" : "Neuer Klient"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vorname *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nachname *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefon</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Land auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AT">Österreich</SelectItem>
                      <SelectItem value="DE">Deutschland</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Straße *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <FormField
                  control={form.control}
                  name="house_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hausnummer *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PLZ *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => handlePostalCodeChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stadt *</FormLabel>
                    <FormControl>
                      {cities.length > 0 ? (
                        <Combobox
                          options={cities.map((city) => ({
                            label: `${city.city} (${city.postal_code})`,
                            value: city.city,
                          }))}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            const cityData = cities.find(
                              (c) => c.city === value,
                            );
                            if (cityData) {
                              form.setValue(
                                "postal_code",
                                cityData.postal_code,
                              );
                            }
                          }}
                        />
                      ) : (
                        <Input {...field} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                    <Loader2 className="h-4 w-4 animate-spin" />
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
