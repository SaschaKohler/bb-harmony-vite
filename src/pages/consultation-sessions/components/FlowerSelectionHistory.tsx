import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Plus, History, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFlowerSelections } from "@/hooks/use-flower-selections";
import { toast } from "sonner";

interface FlowerSelectionHistoryProps {
  sessionId: string;
  clientId: string;
  emotionalStates?: string[];
  onCreateNew: () => void;
}

export function FlowerSelectionHistory({
  sessionId,
  clientId,
  emotionalStates = [],
  onCreateNew,
}: FlowerSelectionHistoryProps) {
  const [activeTab, setActiveTab] = useState("previous");
  const { selections, isLoading, reactivateSelection } =
    useFlowerSelections(clientId);

  const handleReactivate = async (selectionId: string) => {
    try {
      await reactivateSelection.mutateAsync(selectionId);
      toast.success("Blütenmischung wurde reaktiviert");
    } catch (error) {
      toast.error("Fehler beim Reaktivieren der Mischung");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Blütenmischung
          <Button variant="outline" size="sm" onClick={onCreateNew}>
            <Plus className="w-4 h-4 mr-2" />
            Neue Mischung
          </Button>
        </CardTitle>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="previous">
            <History className="w-4 h-4 mr-2" />
            Vorherige Mischungen
          </TabsTrigger>
          <TabsTrigger value="new">
            <Plus className="w-4 h-4 mr-2" />
            Neue Mischung
          </TabsTrigger>
        </TabsList>

        <TabsContent value="previous" className="space-y-4">
          {selections?.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Keine vorherigen Mischungen gefunden
            </div>
          ) : (
            selections?.map((selection) => (
              <Card key={selection.id} className="relative overflow-hidden">
                <CardContent className="pt-6">
                  {selection.is_current && (
                    <Badge
                      className="absolute top-2 right-2"
                      variant="secondary"
                    >
                      Aktuelle Mischung
                    </Badge>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-medium">
                        {format(new Date(selection.date), "dd. MMMM yyyy", {
                          locale: de,
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selection.duration_weeks} Wochen Anwendung
                      </div>
                    </div>
                    <Badge variant="outline">
                      {selection.flowers.length} Blüten
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {selection.flowers.map((flower) => (
                      <Badge key={flower.id} variant="secondary">
                        {flower.name_german || flower.name_english}
                      </Badge>
                    ))}
                  </div>

                  {!selection.is_current && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleReactivate(selection.id)}
                      disabled={reactivateSelection.isPending}
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Diese Mischung verwenden
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="new">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {emotionalStates.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Erfasste emotionale Zustände:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {emotionalStates.map((state, index) => (
                      <Badge key={index} variant="secondary">
                        {state}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={onCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Neue Blütenmischung erstellen
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
