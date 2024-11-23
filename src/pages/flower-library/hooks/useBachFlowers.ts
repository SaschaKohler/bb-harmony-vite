// src/hooks/useBachFlowers.ts
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"] & {
  emotion: Database["public"]["Tables"]["emotion"]["Row"];
};

export function useBachFlowers() {
  return useQuery<BachFlower[]>({
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
          )
        `,
        )
        .order("number");

      if (error) throw error;
      return data || [];
    },
  });
}
