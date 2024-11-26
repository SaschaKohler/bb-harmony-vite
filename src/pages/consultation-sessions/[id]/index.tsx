// src/pages/consultation-sessions/[id]/index.tsx

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useConsultationSessions } from "../hooks/use-consultation-sessions";
import { ConsultationProtocol } from "../components/ConsultationProtocol";
import { FlowerSelection } from "../components/FlowerSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function ConsultationDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { useSession, startConsultation, completeConsultation } =
    useConsultationSessions();
  const { data: session, isLoading, error } = useSession(sessionId!);

  useEffect(() => {
    if (error) {
      toast.error("Fehler beim Laden des Beratungsgesprächs", {
        description: "Das Beratungsgespräch konnte nicht gefunden werden.",
      });
      navigate("/consultation-sessions");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-2">Beratungsgespräch wird geladen...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleStartConsultation = async () => {
    if (!session?.id) return;

    try {
      await startConsultation.mutateAsync(session.id);
      toast.success("Beratungsgespräch gestartet");
    } catch (err) {
      toast.error("Fehler beim Starten des Gesprächs", {
        description: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    }
  };

  const handleCompleteConsultation = async () => {
    if (!session?.id) return;

    try {
      await completeConsultation.mutateAsync(session.id);
      toast.success("Beratungsgespräch abgeschlossen");
    } catch (err) {
      toast.error("Fehler beim Abschließen des Gesprächs", {
        description: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/consultation-sessions")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </Button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Beratungsgespräch mit {session.client_first_name}{" "}
              {session.client_last_name}
            </h1>
            <p className="text-muted-foreground">
              {new Date(session.start_time).toLocaleDateString("de-DE", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Aktions-Buttons basierend auf Session-Status */}
          <div className="flex gap-2">
            {session.status === "scheduled" && (
              <Button
                onClick={handleStartConsultation}
                disabled={startConsultation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {startConsultation.isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Wird gestartet...
                  </>
                ) : (
                  "Gespräch beginnen"
                )}
              </Button>
            )}

            {session.status === "in_progress" && (
              <Button
                onClick={handleCompleteConsultation}
                disabled={completeConsultation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {completeConsultation.isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Wird abgeschlossen...
                  </>
                ) : (
                  "Gespräch abschließen"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="protocol">
        <TabsList>
          <TabsTrigger value="protocol">Gesprächsnotizen</TabsTrigger>
          <TabsTrigger value="flowers">Blütenempfehlung</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="protocol">
            <ConsultationProtocol session={session} />
          </TabsContent>

          <TabsContent value="flowers">
            <FlowerSelection session={session} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
