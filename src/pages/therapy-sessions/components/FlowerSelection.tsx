import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, FlowerIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useTherapySessions } from "../hooks/use-therapy-sessions";
import { useBachFlowerService } from "@/hooks/useBachFlowerService";
import type { SessionWithDetails, FlowerMixtureForSession } from "../types";
import type { BachFlower } from "@/types/bachFlowerTypes";

const mixtureSchema = z.object({
  flowers: z
    .array(z.string())
    .min(1, "Mindestens eine Blüte muss ausgewählt werden")
    .max(7, "Maximal 7 Blüten pro Mischung"),
  notes: z.string().optional(),
  dosage_notes: z.string().default("4x täglich 4 Tropfen in ein Glas Wasser"),
  duration_weeks: z.number().min(1).max(12).default(4),
});

interface FlowerSelectionProps {
  session: SessionWithDetails;
}

export function FlowerSelection({ session }: FlowerSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlowers, setSelectedFlowers] = useState<BachFlower[]>([]);
  const { addFlowerMixture } = useTherapySessions();
  const { flowers, isLoading } = useBachFlowerService();

  const form = useForm<z.infer<typeof mixtureSchema>>({
    resolver: zodResolver(mixtureSchema),
    defaultValues: {
      flowers: [],
      dosage_notes: "4x täglich 4 Tropfen in ein Glas Wasser",
      duration_weeks: 4,
    },
  });

  const filteredFlowers =
    flowers?.filter((flower) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        flower.name_german?.toLowerCase().includes(searchLower) ||
        flower.name_english.toLowerCase().includes(searchLower) ||
        flower.description?.toLowerCase().includes(searchLower)
      );
    }) || [];

  const handleFlowerSelect = (flower: BachFlower) => {
    if (selectedFlowers.length >= 7) {
      toast.warning("Maximale Anzahl von 7 Blüten erreicht");
      return;
    }
    if (selectedFlowers.find((f) => f.id === flower.id)) {
      setSelectedFlowers(selectedFlowers.filter((f) => f.id !== flower.id));
    } else {
      setSelectedFlowers([...selectedFlowers, flower]);
    }
    form.setValue(
      "flowers",
      selectedFlowers.map((f) => f.id),
    );
  };

  const onSubmit = async (values: z.infer<typeof mixtureSchema>) => {
    try {
      await addFlowerMixture.mutateAsync({
        session_id: session.id,
        flowers: selectedFlowers.map((f) => f.id),
        notes: values.notes,
        dosage_notes: values.dosage_notes,
        duration_weeks: values.duration_weeks,
      });

      setSelectedFlowers([]);
      form.reset();
    } catch (error) {
      console.error("Error creating flower mixture:", error);
    }
  };

  // Zeige bestehende Mischung, falls vorhanden
  if (session.flower_selection && !form.formState.isDirty) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">
                Aktuelle Blütenmischung
              </CardTitle>
              <CardDescription>
                Erstellt am{" "}
                {format(
                  new Date(session.flower_selection.created_at),
                  "dd.MM.yyyy",
                )}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => form.reset()}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Neue Mischung
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {session.flower_selection.flowers.map((flower) => (
                <Badge key={flower.id} variant="secondary">
                  <FlowerIcon className="w-3 h-3 mr-1" />
                  {flower.name_german || flower.name_english}
                </Badge>
              ))}
            </div>
            {session.flower_selection.dosage_notes && (
              <div>
                <h4 className="font-medium text-sm mb-1">Dosierung</h4>
                <p className="text-sm text-muted-foreground">
                  {session.flower_selection.dosage_notes}
                </p>
              </div>
            )}
            {session.flower_selection.notes && (
              <div>
                <h4 className="font-medium text-sm mb-1">Notizen</h4>
                <p className="text-sm text-muted-foreground">
                  {session.flower_selection.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blütenauswahl */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Blüten auswählen</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Blüten suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {filteredFlowers.map((flower) => (
              <Badge
                key={flower.id}
                variant={
                  selectedFlowers.find((f) => f.id === flower.id)
                    ? "secondary"
                    : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleFlowerSelect(flower)}
              >
                <FlowerIcon className="w-3 h-3 mr-1" />
                {flower.name_german || flower.name_english}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mischungsdetails */}
      {selectedFlowers.length > 0 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ausgewählte Blüten</CardTitle>
                <CardDescription>
                  {selectedFlowers.length} von maximal 7 Blüten ausgewählt
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedFlowers.map((flower) => (
                    <Badge
                      key={flower.id}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleFlowerSelect(flower)}
                    >
                      <FlowerIcon className="w-3 h-3 mr-1" />
                      {flower.name_german || flower.name_english}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="dosage_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosierung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Dosierungsempfehlung..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notizen zur Mischung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Zusätzliche Hinweise..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration_weeks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Einnahmedauer (Wochen)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={12}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  addFlowerMixture.isPending || selectedFlowers.length === 0
                }
              >
                {addFlowerMixture.isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Mischung erstellen
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
