import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { DBEmotion, DBBachFlower } from "../types";

export function useWizardData() {
  const [emotions, setEmotions] = useState<DBEmotion[]>([]);
  const [bachFlowers, setBachFlowers] = useState<DBBachFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [emotionsResponse, flowersResponse] = await Promise.all([
          supabase.from("emotion").select("*").order("name"),
          supabase
            .from("bach_flowers")
            .select(
              `
              *,
              emotion:emotion_id(*)
            `,
            )
            .order("number"),
        ]);

        if (emotionsResponse.error) throw emotionsResponse.error;
        if (flowersResponse.error) throw flowersResponse.error;

        setEmotions(emotionsResponse.data);
        setBachFlowers(flowersResponse.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ein Fehler ist aufgetreten",
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return {
    emotions,
    bachFlowers,
    loading,
    error,
  };
}
