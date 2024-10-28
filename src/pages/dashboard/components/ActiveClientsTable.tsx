import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

type ActiveClient = {
  id: string;
  first_name: string;
  last_name: string;
  last_selection_date: string;
  active_selections: number;
  total_selections: number;
};

export function ActiveClientsTable() {
  const [clients, setClients] = useState<ActiveClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveClients();
  }, []);

  const fetchActiveClients = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("clients")
        .select(
          `
          id,
          first_name,
          last_name,
          flower_selections (
            id,
            date,
            status
          )
        `,
        )
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      const activeClients = (data || [])
        .map((client) => {
          const selections = client.flower_selections || [];
          const activeSelections = selections.filter(
            (s) => s.status === "active" && new Date(s.date) >= thirtyDaysAgo,
          );

          return {
            id: client.id,
            first_name: client.first_name,
            last_name: client.last_name,
            last_selection_date:
              selections.length > 0
                ? selections.sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )[0].date
                : null,
            active_selections: activeSelections.length,
            total_selections: selections.length,
          };
        })
        .sort((a, b) => b.active_selections - a.active_selections);

      setClients(activeClients);
    } catch (error) {
      console.error("Error fetching active clients:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4 text-muted-foreground">Lade...</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Letzte Auswahl</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Gesamt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-center text-muted-foreground"
            >
              Keine aktiven Klienten gefunden
            </TableCell>
          </TableRow>
        ) : (
          clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <Link
                  to={`/clients/${client.id}`}
                  className="font-medium hover:underline"
                >
                  {client.first_name} {client.last_name}
                </Link>
              </TableCell>
              <TableCell>
                {client.last_selection_date ? (
                  format(new Date(client.last_selection_date), "dd.MM.yyyy", {
                    locale: de,
                  })
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {client.active_selections > 0 ? (
                  <Badge variant="success">
                    {client.active_selections} aktiv
                  </Badge>
                ) : (
                  <Badge variant="secondary">Inaktiv</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                {client.total_selections}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
