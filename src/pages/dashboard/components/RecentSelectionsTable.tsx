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

type RecentSelection = {
  id: string;
  date: string;
  client: {
    first_name: string;
    last_name: string;
  };
  selection_flowers: {
    flower: {
      name_german: string;
    };
  }[];
};

export function RecentSelectionsTable() {
  const [selections, setSelections] = useState<RecentSelection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSelections();
  }, []);

  const fetchRecentSelections = async () => {
    try {
      const { data, error } = await supabase
        .from("flower_selections")
        .select(
          `
          id,
          date,
          client:clients(first_name, last_name),
          selection_flowers(
            flower:bach_flowers(name_german)
          )
        `,
        )
        .order("date", { ascending: false })
        .limit(5);

      if (error) throw error;
      setSelections(data || []);
    } catch (error) {
      console.error("Error fetching recent selections:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Lade...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Datum</TableHead>
          <TableHead>Klient</TableHead>
          <TableHead>Blüten</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {selections.map((selection) => (
          <TableRow key={selection.id}>
            <TableCell>
              {format(new Date(selection.date), "dd.MM.yyyy", {
                locale: de,
              })}
            </TableCell>
            <TableCell>
              {selection.client?.first_name} {selection.client?.last_name}
            </TableCell>
            <TableCell>{selection.selection_flowers.length} Blüten</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
