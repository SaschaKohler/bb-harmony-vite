import React from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

interface ConsultationHistoryProps {
  clientId: string;
  currentSessionId: string;
}

export function ConsultationHistory({
  clientId,
  currentSessionId,
}: ConsultationHistoryProps) {
  // Hole alle vorherigen Beratungen für diesen Klienten
  const { data: previousSessions = [] } = useQuery({
    queryKey: ["client-sessions-history", clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultation_sessions")
        .select(
          `
          *,
          protocol:consultation_protocols (
            current_situation,
            emotional_states,
            goals,
            recommendations
          ),
          flower_selection:flower_selections (
            id,
            notes,
            flowers:selection_flowers (
              flower:bach_flowers (
                id,
                name_german,
                name_english
              )
            )
          )
        `,
        )
        .eq("client_id", clientId)
        .neq("id", currentSessionId)
        .order("start_time", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (previousSessions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frühere Beratungen</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {previousSessions.map((session) => (
              <Card key={session.id} className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(session.start_time), "dd. MMMM yyyy", {
                      locale: de,
                    })}
                  </div>

                  {session.protocol?.emotional_states?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {session.protocol.emotional_states.map((state, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {state}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {session.protocol?.current_situation && (
                    <div className="mb-2">
                      <div className="font-medium text-sm mb-1">Situation:</div>
                      <p className="text-sm text-muted-foreground">
                        {session.protocol.current_situation}
                      </p>
                    </div>
                  )}

                  {session.flower_selection?.flowers?.length > 0 && (
                    <div>
                      <div className="font-medium text-sm mb-1">
                        Blütenmischung:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {session.flower_selection.flowers.map((f) => (
                          <Badge
                            key={f.flower.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {f.flower.name_german || f.flower.name_english}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
