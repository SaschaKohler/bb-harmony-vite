// src/pages/bachblueten-wizard/hooks/use-wizard-data.ts

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";

type Symptom = Database["public"]["Tables"]["symptoms"]["Row"];
type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

export function useWizardData() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [bachFlowers, setBachFlowers] = useState<BachFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        // Lade zuerst die Symptomgruppen
        const { data: symptomGroups, error: groupsError } = await supabase
          .from("symptom_groups")
          .select("*")
          .order("name");

        if (groupsError) throw groupsError;

        console.log("Gefundene Symptomgruppen:", symptomGroups);
        // Lade Symptome mit Gruppenzuordnung
        const { data: symptomsData, error: symptomsError } = await supabase
          .from("symptoms")
          .select(
            `
            *,
            group:symptom_groups!inner(
              id,
              name,
              emotion_category
            )
          `,
          )
          .order("name");
        if (symptomsError) throw symptomsError;

        // Lade Bachblüten mit Verknüpfungen
        const { data: flowersData, error: flowersError } = await supabase
          .from("bach_flowers")
          .select(
            `
            *,
            flower_symptom_relations!inner(
              symptom_id,
              is_primary
            )
          `,
          )
          .order("name_german");

        if (flowersError) throw flowersError;

        // Transformiere die Daten für die Verwendung in der UI
        const transformedSymptoms = symptomsData.map((symptom) => ({
          ...symptom,
          emotion_category: symptom.group.emotion_category,
        }));

        setSymptoms(transformedSymptoms);
        setBachFlowers(flowersData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Fehler beim Laden der Daten",
        );
        console.error("Fehler beim Laden der Wizard-Daten:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    symptoms,
    bachFlowers,
    loading,
    error,
    // Helper Funktion um Symptome für eine bestimmte Emotionsgruppe zu finden
    getSymptomsByEmotionGroup: (emotionGroup: string) => {
      return symptoms.filter(
        (symptom) => symptom.group?.emotion_category === emotionGroup,
      );
    },
  };
}
