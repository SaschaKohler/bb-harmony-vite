import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

export interface FlowerSelectionHistory {
  id: string;
  date: string;
  notes: string | null;
  dosage_notes: string | null;
  duration_weeks: number;
  status: string;
  flower_count: number;
  is_current: boolean;
  flowers: {
    id: string;
    name_german: string | null;
    name_english: string;
  }[];
}

export function useFlowerSelections(clientId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: selections, isLoading } = useQuery({
    queryKey: ["flower-selections", clientId],
    queryFn: async () => {
      if (!clientId || !user?.id) return [];

      const { data, error } = await supabase.rpc("get_client_selections", {
        p_client_id: clientId,
      });

      if (error) throw error;

      // Hole die Details der Blüten für jede Selektion
      const selectionsWithFlowers = await Promise.all(
        data.map(async (selection) => {
          const { data: flowerData } = await supabase
            .from("selection_flowers")
            .select(
              `
              flower:bach_flowers (
                id,
                name_german,
                name_english
              )
            `,
            )
            .eq("selection_id", selection.id);

          return {
            ...selection,
            flowers: flowerData?.map((f) => f.flower) || [],
          };
        }),
      );

      return selectionsWithFlowers as FlowerSelectionHistory[];
    },
    enabled: !!clientId && !!user?.id,
  });

  const createSelection = useMutation({
    mutationFn: async ({
      sessionId,
      flowers,
      notes,
      dosageNotes,
      durationWeeks,
    }: {
      sessionId: string;
      flowers: string[];
      notes?: string;
      dosageNotes: string;
      durationWeeks: number;
    }) => {
      if (!user?.id) throw new Error("No user ID available");

      const { data: session } = await supabase
        .from("consultation_sessions")
        .select("client_id, therapist_id")
        .eq("id", sessionId)
        .single();

      if (!session) throw new Error("Session not found");

      // 1. Create flower selection
      const { data: selection, error } = await supabase
        .from("flower_selections")
        .insert([
          {
            client_id: session.client_id,
            therapist_id: session.therapist_id,
            session_id: sessionId,
            date: new Date().toISOString(),
            notes,
            dosage_notes: dosageNotes,
            duration_weeks: durationWeeks,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // 2. Add flowers to selection
      const flowerEntries = flowers.map((flowerId, index) => ({
        selection_id: selection.id,
        flower_id: flowerId,
        position: index + 1,
      }));

      const { error: flowersError } = await supabase
        .from("selection_flowers")
        .insert(flowerEntries);

      if (flowersError) throw flowersError;

      return selection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flower-selections"] });
    },
  });

  const reactivateSelection = useMutation({
    mutationFn: async (selectionId: string) => {
      // 1. Set all other selections to inactive
      await supabase
        .from("flower_selections")
        .update({ status: "inactive" })
        .eq("client_id", clientId);

      // 2. Reactivate the selected one
      const { data, error } = await supabase
        .from("flower_selections")
        .update({
          status: "active",
          date: new Date().toISOString(),
        })
        .eq("id", selectionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flower-selections"] });
    },
  });

  return {
    selections,
    isLoading,
    createSelection,
    reactivateSelection,
  };
}
