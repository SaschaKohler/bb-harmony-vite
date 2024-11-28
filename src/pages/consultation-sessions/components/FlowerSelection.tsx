import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, X, Save } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FlowerSelectionHistory } from "./FlowerSelectionHistory";
import { useFlowerSelections } from "@/hooks/use-flower-selections";
import { useBachFlowerService } from "@/hooks/useBachFlowerService";
import type { ConsultationSessionWithDetails } from "../types";
import type { BachFlower } from "@/types/bachFlowerTypes";
import { toast } from "sonner";
import { ConsultationHistory } from "./ConsultationHistory";

const flowerMixtureSchema = z.object({
  flowers: z
    .array(z.string())
    .min(1, "Mindestens eine Blüte muss ausgewählt werden")
    .max(7, "Maximal 7 Blüten pro Mischung"),
  notes: z.string().optional(),
  dosage_notes: z.string().default("4x täglich 4 Tropfen in ein Glas Wasser"),
  duration_weeks: z.number().min(1).max(12).default(4),
});

interface FlowerSelectionProps {
  session: ConsultationSessionWithDetails;
}

export function FlowerSelection({ session }: FlowerSelectionProps) {
  const [showSelectionForm, setShowSelectionForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlowers, setSelectedFlowers] = useState<BachFlower[]>([]);

  const { createSelection } = useFlowerSelections(session.client_id);
  const { getRecommendationsQuery, isLoading } = useBachFlowerService();
  // Hole Empfehlungen basierend auf den protokollierten emotionalen Zuständen
  // const recommendations = getEnhancedRecommendations(
  //   session.protocol?.emotional_states || [],
  // );

  // Hole die emotionalen Zustände aus dem Protokoll
  const emotionalStates = session.protocol?.emotional_states || [];

  // Nutze die Query für Empfehlungen
  const { data: recommendations = [] } = useQuery(
    getRecommendationsQuery(emotionalStates),
  );

  console.log("Emotional States:", emotionalStates); // Debug
  console.log("Recommendations:", recommendations); // Debug

  const form = useForm({
    resolver: zodResolver(flowerMixtureSchema),
    defaultValues: {
      flowers: [],
      dosage_notes: "4x täglich 4 Tropfen in ein Glas Wasser",
      duration_weeks: 4,
      notes: "",
    },
  });

  // Filtere die Empfehlungen basierend auf der Suche
  const filteredRecommendations = recommendations.filter((rec) => {
    const searchLower = searchTerm.toLowerCase();
    const flower = rec.flower;

    return (
      flower.name_german?.toLowerCase().includes(searchLower) ||
      flower.name_english.toLowerCase().includes(searchLower) ||
      flower.description?.toLowerCase().includes(searchLower) ||
      rec.matchSources.some((source) =>
        source.term.toLowerCase().includes(searchLower),
      )
    );
  });
  const { data: previousSelections, refetch } = useQuery({
    queryKey: ["flower-selections", session.client_id],
    queryFn: () => getClientSelections(session.client_id),
  });

  // Bei Öffnung der Historie automatisch neu laden
  useEffect(() => {
    if (!showSelectionForm) {
      refetch();
    }
  }, [showSelectionForm, refetch]);
  const handleFlowerSelect = (recommendation: (typeof recommendations)[0]) => {
    if (
      selectedFlowers.length >= 7 &&
      !selectedFlowers.find((f) => f.id === recommendation.flower.id)
    ) {
      toast.warning("Maximal 7 Blüten pro Mischung möglich");
      return;
    }

    setSelectedFlowers((current) => {
      const isSelected = current.find((f) => f.id === recommendation.flower.id);
      if (isSelected) {
        return current.filter((f) => f.id !== recommendation.flower.id);
      } else {
        return [...current, recommendation.flower];
      }
    });

    form.setValue(
      "flowers",
      selectedFlowers.map((f) => f.id),
    );
  };

  const onSubmit = async (values: z.infer<typeof flowerMixtureSchema>) => {
    try {
      await createSelection.mutateAsync({
        sessionId: session.id,
        flowers: values.flowers,
        notes: values.notes,
        dosageNotes: values.dosage_notes,
        durationWeeks: values.duration_weeks,
      });

      setShowSelectionForm(false);
      setSelectedFlowers([]);
      form.reset();

      toast.success("Blütenmischung wurde erfolgreich gespeichert");
    } catch (error) {
      toast.error("Fehler beim Erstellen der Blütenmischung", {
        description:
          error instanceof Error ? error.message : "Unbekannter Fehler",
      });
    }
  };
  // Wenn das Formular nicht angezeigt wird, zeige die Historie oder aktuelle Mischung
  if (!showSelectionForm) {
    return (
      <div className="space-y-6">
        <FlowerSelectionHistory
          sessionId={session.id}
          clientId={session.client_id}
          emotionalStates={session.protocol?.emotional_states}
          onCreateNew={() => setShowSelectionForm(true)}
        />

        {/* Vorherige Beratungen */}
        <ConsultationHistory
          clientId={session.client_id}
          currentSessionId={session.id}
        />
      </div>
    );
  }
  // Zeige bestehende Mischung falls vorhanden
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Empfohlene Blüten</CardTitle>
          <CardDescription>
            Basierend auf {session.protocol?.emotional_states?.length || 0}{" "}
            emotionalen Zuständen
          </CardDescription>
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
          <div className="space-y-4">
            {/* Ausgewählte Blüten */}
            {selectedFlowers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Ausgewählte Blüten ({selectedFlowers.length}/7)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFlowers.map((flower) => (
                    <Badge
                      key={flower.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80"
                      onClick={() =>
                        handleFlowerSelect({
                          flower,
                          matchScore: 0,
                          matchSources: [],
                        })
                      }
                    >
                      {flower.name_german || flower.name_english}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Liste der empfohlenen Blüten */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredRecommendations.map((recommendation) => (
                  <Button
                    key={recommendation.flower.id}
                    variant="outline"
                    className={cn(
                      "justify-start text-left h-auto py-3",
                      selectedFlowers.find(
                        (f) => f.id === recommendation.flower.id,
                      ) && "bg-secondary",
                    )}
                    onClick={() => handleFlowerSelect(recommendation)}
                    disabled={
                      selectedFlowers.length >= 7 &&
                      !selectedFlowers.find(
                        (f) => f.id === recommendation.flower.id,
                      )
                    }
                  >
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {recommendation.flower.name_german ||
                            recommendation.flower.name_english}
                        </span>
                        <Badge variant="outline" className="ml-2">
                          {recommendation.matchScore}%
                        </Badge>
                      </div>

                      {recommendation.flower.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {recommendation.flower.description}
                        </p>
                      )}

                      {recommendation.matchSources.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {recommendation.matchSources.map((source, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {source.term}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mischungsdetails Formular */}
      {selectedFlowers.length > 0 && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mischungsdetails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dosierung */}
                <FormField
                  control={form.control}
                  name="dosage_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosierung</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Dosierungsempfehlung..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Einnahmedauer */}
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

                {/* Zusätzliche Notizen */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zusätzliche Notizen</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Weitere Hinweise zur Mischung..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowSelectionForm(false)}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                disabled={
                  createSelection.isPending || selectedFlowers.length === 0
                }
              >
                {createSelection.isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Mischung speichern
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
