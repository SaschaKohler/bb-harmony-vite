// src/hooks/useBachFlowers.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";
import { toast } from "sonner";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"] & {
  emotion: Database["public"]["Tables"]["emotion"]["Row"];
};

export function useBachFlowers() {
  return useQuery({
    queryKey: ["bach-flowers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bach_flowers")
        .select(
          `
          *,
          emotion (
            id,
            name,
            description,
            color
          ),
          flower_symptom_relations (
            id,
            symptom_id,
            is_primary,
            symptom:symptoms (
              id,
              name,
              description
            )
          )
        `,
        )
        .order("number");

      if (error) {
        toast.error("Fehler beim Laden der Bachblüten");
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}
