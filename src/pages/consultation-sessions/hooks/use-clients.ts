import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/types/supabase";
import { toast } from "sonner";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export function useClients() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["clients", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("No user ID available");
      }

      console.log("Fetching clients for therapist:", user.id); // Debug log

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("therapist_id", user.id)
        .order("last_name", { ascending: true });

      if (error) {
        console.error("Error fetching clients:", error); // Debug log
        throw error;
      }

      console.log("Fetched clients:", data); // Debug log
      return data as Client[];
    },
    enabled: !!user?.id,
    onError: (error) => {
      console.error("Client fetch error:", error);
      toast.error("Fehler beim Laden der Klienten");
    },
  });

  return {
    ...query,
    clients: query.data ?? [],
  };
}
