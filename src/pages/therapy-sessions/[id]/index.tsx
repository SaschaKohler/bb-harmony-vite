import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTherapySessions } from "../hooks/use-therapy-sessions";
import { SessionProtocol } from "../components/SessionProtocol";
import { FlowerSelection } from "../components/FlowerSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function TherapySessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { useSession, startSession, completeSession } = useTherapySessions();
  const { data: session, isLoading, error } = useSession(sessionId!);

  useEffect(() => {
    if (error) {
      toast.error("Fehler beim Laden der Sitzung", {
        description: "Die Sitzung konnte nicht gefunden werden.",
      });
      navigate("/therapy-sessions");
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="ml-2">Sitzung wird geladen...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleStartSession = async () => {
    if (!session?.id) return;

    try {
      await startSession(session.id);
      toast.success("Sitzung gestartet");
    } catch (err) {
      toast.error("Fehler beim Starten der Sitzung", {
        description: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    }
  };

  const handleCompleteSession = async () => {
    if (!session?.id) return;

    try {
      await completeSession(session.id);
      toast.success("Sitzung abgeschlossen");
    } catch (err) {
      toast.error("Fehler beim Abschließen der Sitzung", {
        description: err instanceof Error ? err.message : "Unbekannter Fehler",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/therapy-sessions")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </Button>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Sitzung mit {session.client.first_name} {session.client.last_name}
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

          <div className="flex gap-2">
            {session?.status === "scheduled" && (
              <Button onClick={handleStartSession} disabled={!session?.id}>
                Sitzung starten
              </Button>
            )}

            {session?.status === "in_progress" && (
              <Button onClick={handleCompleteSession} disabled={!session?.id}>
                Sitzung abschließen
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="protocol">
        <TabsList>
          <TabsTrigger value="protocol">Protokoll</TabsTrigger>
          <TabsTrigger value="flowers">Blütenmischung</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="protocol">
            <SessionProtocol session={session} />
          </TabsContent>

          <TabsContent value="flowers">
            <FlowerSelection session={session} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
