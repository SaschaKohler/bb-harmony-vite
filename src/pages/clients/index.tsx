import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientFilters } from "./components/ClientFilters";
import {
  ArrowUpDown,
  User,
  Mail,
  Phone,
  MapPin,
  TestTube,
  Calendar,
  Settings2,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

// Erweiterte Client Type Definition
type ClientWithStats = Database["public"]["Tables"]["clients"]["Row"] & {
  _count: {
    mixtures: number; // Behalten wir für zukünftige Erweiterungen
    selections: number;
  };
  last_visit?: string;
  flower_selections?: Database["public"]["Tables"]["flower_selections"]["Row"][];
};

const columns: ColumnDef<ClientWithStats>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
          <User className="h-4 w-4 text-violet-700" />
        </div>
        <div>
          <div className="font-medium">
            {row.original.first_name} {row.original.last_name}
          </div>
          {row.original.last_visit && (
            <div className="text-sm text-muted-foreground">
              Letzter Besuch:{" "}
              {format(new Date(row.original.last_visit), "dd.MM.yyyy", {
                locale: de,
              })}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "contact",
    header: "Kontakt",
    cell: ({ row }) => (
      <div className="space-y-1">
        {row.original.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a
              href={`mailto:${row.original.email}`}
              className="text-blue-600 hover:underline"
            >
              {row.original.email}
            </a>
          </div>
        )}
        {row.original.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${row.original.phone}`} className="hover:underline">
              {row.original.phone}
            </a>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Adresse",
    cell: ({ row }) =>
      row.original.address ? (
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.address}</span>
        </div>
      ) : null,
  },
  {
    accessorKey: "stats",
    header: "Statistiken",
    cell: ({ row }) => (
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <TestTube className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {row.original._count.selections}
          </span>
          <span className="text-sm text-muted-foreground">Mixturen</span>
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("Edit", row.original.id)}
        >
          <Settings2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => console.log("New Mixture", row.original.id)}
        >
          <TestTube className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

export default function ClientListPage() {
  const [clients, setClients] = useState<ClientWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [nameFilter, setNameFilter] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);

      // Hauptabfrage für Klienten
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select(
          `
        *,
        flower_selections (
          id,
          date
        )
      `,
        )
        .order("last_name", { ascending: true });

      if (clientsError) throw clientsError;

      // Verarbeite die Daten mit den korrekten Zählungen
      const clientsWithStats = (clientsData || []).map((client) => {
        const selections = client.flower_selections || [];

        // Finde das letzte Besuchsdatum
        const lastVisit =
          selections.length > 0
            ? selections.reduce((latest, curr) => {
                const currDate = new Date(curr.date);
                return latest > currDate ? latest : currDate;
              }, new Date(0))
            : null;

        return {
          ...client,
          _count: {
            // Da wir keine separate mixtures Tabelle haben, setzen wir dies auf 0
            mixtures: 0,
            selections: selections.length,
          },
          last_visit: lastVisit ? lastVisit.toISOString() : null,
        };
      });

      setClients(clientsWithStats);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = React.useMemo(() => {
    return clients.filter((client) => {
      const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
      return fullName.includes(nameFilter.toLowerCase());
    });
  }, [clients, nameFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-muted-foreground">Lade Kunden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Kundenliste</h1>
          <p className="text-muted-foreground mt-1">
            {filteredData.length} Kunden insgesamt
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Neuer Kunde
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Nach Namen suchen..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-muted/50">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center h-24 text-muted-foreground"
                >
                  Keine Kunden gefunden
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
