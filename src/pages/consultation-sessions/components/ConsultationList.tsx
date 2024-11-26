// src/pages/consultation-sessions/components/ConsultationList.tsx

import { useNavigate } from "react-router-dom";
import { Calendar, FileText, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { ConsultationSessionWithDetails } from "../types";

interface ConsultationListProps {
  sessions: ConsultationSessionWithDetails[];
  onSelectSession: (session: ConsultationSessionWithDetails) => void;
}

const consultationTypeLabels: Record<string, string> = {
  initial_consultation: "Erstgespräch",
  follow_up: "Folgegespräch",
  emergency: "Notfallberatung",
  online: "Online-Beratung",
};

const statusLabels: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "success" | "destructive" | "warning";
  }
> = {
  scheduled: { label: "Geplant", variant: "default" },
  in_progress: { label: "In Beratung", variant: "secondary" },
  completed: { label: "Abgeschlossen", variant: "success" },
  cancelled: { label: "Storniert", variant: "destructive" },
  no_show: { label: "Nicht erschienen", variant: "warning" },
};

export function ConsultationList({
  sessions,
  onSelectSession,
}: ConsultationListProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusInfo = statusLabels[status] || statusLabels.scheduled;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="grid gap-4">
      {sessions.map((session) => (
        <Card
          key={session.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/consultation-sessions/${session.id}`)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">
                    {session.client_first_name} {session.client_last_name}
                  </span>
                  {getStatusBadge(session.status)}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(
                      new Date(session.start_time),
                      "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'",
                      { locale: de },
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {consultationTypeLabels[session.session_type]}
                  </div>
                </div>

                {session.current_situation && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {session.current_situation}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                {session.flower_selection_id && (
                  <Badge variant="secondary" className="ml-2">
                    {session.flower_selection_id?.flowers.length}{" "}
                    Blütenempfehlung
                    {session.flower_selection_id?.flowers.length !== 1
                      ? "en"
                      : ""}
                  </Badge>
                )}

                {session.follow_up_date && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Folgegespräch:{" "}
                    {format(new Date(session.follow_up_date), "d. MMMM yyyy", {
                      locale: de,
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Emotionale Zustände als Tags anzeigen */}
            {session.emotional_states &&
              session.emotional_states.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {session.emotional_states.map((state, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-background"
                    >
                      {state}
                    </Badge>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>
      ))}

      {sessions.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            Keine Beratungsgespräche gefunden
          </CardContent>
        </Card>
      )}
    </div>
  );
}
