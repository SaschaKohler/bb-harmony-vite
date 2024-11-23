import { useState } from "react";
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

export function SessionList({ sessions, onSelectSession }: SessionListProps) {
  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "success" | "destructive" | "warning"
    > = {
      scheduled: "default",
      in_progress: "secondary",
      completed: "success",
      cancelled: "destructive",
      no_show: "warning",
    };

    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };
  console.log(sessions);
  return (
    <div className="grid gap-4">
      {sessions.map((session) => (
        <Card
          key={session.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onSelectSession(session)}
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
                    {format(new Date(session.start_time), "PPp", {
                      locale: de,
                    })}
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {session.session_type}
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
