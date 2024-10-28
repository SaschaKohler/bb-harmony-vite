import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FlowerFormDialog } from "./FlowerFormDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type BachFlower = Database["public"]["Tables"]["bach_flowers"]["Row"];

export function BachFlowersList() {
  const [flowers, setFlowers] = useState<BachFlower[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlowers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bach_flowers")
        .select("*")
        .order("number");

      if (error) throw error;
      setFlowers(data || []);
    } catch (error) {
      toast.error("Fehler beim Laden der Bachblüten");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bach_flowers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Bachblüte erfolgreich gelöscht");
      fetchFlowers();
    } catch (error) {
      toast.error("Fehler beim Löschen der Bachblüte");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-muted-foreground">Lade Bachblüten...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Bachblüten</h2>
          <p className="text-sm text-muted-foreground">
            Verwalten Sie die Bachblüten-Essenzenliste
          </p>
        </div>
        <FlowerFormDialog onSuccess={fetchFlowers} />
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nr.</TableHead>
              <TableHead>Name (EN)</TableHead>
              <TableHead>Name (DE)</TableHead>
              <TableHead>Lat. Name</TableHead>
              <TableHead>Farbe</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flowers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-muted-foreground"
                >
                  Keine Bachblüten gefunden
                </TableCell>
              </TableRow>
            ) : (
              flowers.map((flower) => (
                <TableRow key={flower.id}>
                  <TableCell>{flower.number}</TableCell>
                  <TableCell>{flower.name_english}</TableCell>
                  <TableCell>{flower.name_german}</TableCell>
                  <TableCell className="font-italic">
                    {flower.name_latin}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{
                          backgroundColor: flower.color || "transparent",
                        }}
                      />
                      {flower.color}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <FlowerFormDialog
                        flower={flower}
                        onSuccess={fetchFlowers}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Bachblüte löschen?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Möchten Sie die Bachblüte "{flower.name_german}"
                              wirklich löschen? Diese Aktion kann nicht
                              rückgängig gemacht werden.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(flower.id)}
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
