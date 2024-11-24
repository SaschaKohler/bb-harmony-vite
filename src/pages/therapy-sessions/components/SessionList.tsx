import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import type { SessionWithDetails } from "../types";

interface SessionListProps {
  sessions: SessionWithDetails[];
  onSelectSession: (session: SessionWithDetails) => void;
}

const sessionTypeLabels: Record<string, string> = {
  initial_consultation: "Erstgespräch",
  follow_up: "Folgesitzung",
  emergency: "Notfallsitzung",
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
  in_progress: { label: "In Bearbeitung", variant: "secondary" },
  completed: { label: "Abgeschlossen", variant: "success" },
  cancelled: { label: "Storniert", variant: "destructive" },
  no_show: { label: "Nicht erschienen", variant: "warning" },
};

export function SessionList({ sessions, onSelectSession }: SessionListProps) {
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
          onClick={() => navigate(`/therapy-sessions/${session.id}`)}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">
                    {session.client?.first_name} {session.client?.last_name}
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
                    {sessionTypeLabels[session.session_type]}
                  </div>
                </div>
              </div>

              {session.flower_selection && (
                <Badge variant="secondary" className="ml-2">
                  {session.flower_selection.flowers.length} Blüten
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
