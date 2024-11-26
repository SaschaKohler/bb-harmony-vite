// src/pages/consultation-sessions/index.tsx

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConsultationSessions } from "./hooks/use-consultation-sessions";
import { ConsultationList } from "./components/ConsultationList";
import type { CreateConsultationInput, ConsultationWithDetails } from "./types";
import { ConsultationFormDialog } from "./components/ConsultationFormDialog";

export default function ConsultationSessionsPage() {
  const { sessions, isLoading, setActiveSession, createSession } =
    useConsultationSessions();
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredSessions = sessions?.filter((session) => {
    const nameMatch = `${session.client_first_name} ${session.client_last_name}`
      .toLowerCase()
      .includes(filter.toLowerCase());
    const statusMatch =
      statusFilter === "all" || session.status === statusFilter;
    return nameMatch && statusMatch;
  });

  const handleCreateSession = async (data: CreateConsultationInput) => {
    console.log(data);
    await createSession.mutateAsync(data);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Beratungsgespräche</h1>
        <ConsultationFormDialog
          trigger={
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Neues Gespräch
            </Button>
          }
          onSubmit={handleCreateSession}
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Nach Namen suchen..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="scheduled">Geplant</SelectItem>
                <SelectItem value="in_progress">In Beratung</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
                <SelectItem value="cancelled">Storniert</SelectItem>
                <SelectItem value="no_show">Nicht erschienen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <ConsultationList
          sessions={filteredSessions || []}
          onSelectSession={setActiveSession}
        />
      )}
    </div>
  );
}
