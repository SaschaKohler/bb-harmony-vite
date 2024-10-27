import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { supabase } from "@/lib/supabaseClient";
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
import { SelectionFilters } from "./components/SelectionFilters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Eye, Download, Printer, ArrowUpDown } from "lucide-react";
import FlowerSelectionDetails from "./components/FlowerSelectionDetails";
import { toast } from "sonner";

// Typen für unsere Daten
type FlowerSelection = {
  id: string;
  client_id: string;
  date: string;
  notes: string | null;
  created_at: string;
  duration_weeks: number;
  status: "active" | "completed";
  client: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  selection_flowers: {
    position: number;
    flower: {
      id: string;
      name_german: string;
      name_english: string;
      number: number;
    };
  }[];
};

const columns: ColumnDef<FlowerSelection>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Datum
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">
        {format(new Date(row.original.date), "dd.MM.yyyy", { locale: de })}
      </div>
    ),
  },
  {
    accessorKey: "timeframe",
    header: "Zeitraum",
    cell: ({ row }) => {
      const startDate = new Date(row.original.date);
      const endDate = new Date(startDate);
      endDate.setDate(
        startDate.getDate() + (row.original.duration_weeks || 4) * 7,
      );
      const isActive = endDate > new Date();

      return (
        <div className="flex flex-col">
          <span className="text-sm">
            {format(startDate, "dd.MM.yyyy", { locale: de })} -{" "}
            {format(endDate, "dd.MM.yyyy", { locale: de })}
          </span>
          {isActive && (
            <span className="text-xs text-green-600 font-medium">Aktiv</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent"
        >
          Klient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const client = row.original.client;
      if (!client)
        return (
          <div className="font-medium text-muted-foreground">Kein Klient</div>
        );

      return (
        <div className="font-medium">
          {[client.first_name, client.last_name].filter(Boolean).join(" ") ||
            "Unbekannt"}
        </div>
      );
    },
  },
  {
    accessorKey: "flowerCount",
    header: "Anzahl Blüten",
    cell: ({ row }) => (
      <div className="text-center">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-medium">
          {row.original.selection_flowers.length}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <SelectionActions selection={row.original} />,
  },
];
// Komponente für die Aktions-Buttons
const SelectionActions: React.FC<{ selection: FlowerSelection }> = ({
  selection,
}) => {
  return (
    <div className="flex gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Blütenauswahl Details</SheetTitle>
          </SheetHeader>
          <FlowerSelectionDetails selection={selection} />
        </SheetContent>
      </Sheet>

      <Button variant="outline" size="icon">
        <Printer className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function FlowerSelectionListPage() {
  const [selections, setSelections] = useState<FlowerSelection[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [clientFilter, setClientFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date>();

  const resetFilters = () => {
    setClientFilter("");
    setDateFilter(undefined);
  };

  useEffect(() => {
    fetchSelections();
  }, []);

  async function fetchSelections() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("flower_selections")
        .select(
          `
          *,
          client:clients(first_name, last_name),
          selection_flowers(
            position,
            flower:bach_flowers(
              id,
              name_german,
              name_english,
              number
            )
          )
        `,
        )
        .order("date", { ascending: false });

      if (error) throw error;

      const processedData = (data || []).map((selection) => ({
        ...selection,
        duration_weeks: selection.duration_weeks || 4,
        status: selection.status || "active",
        client: selection.client || null,
        selection_flowers: selection.selection_flowers || [],
      }));

      setSelections(processedData);
    } catch (error) {
      console.error("Error fetching selections:", error);
      toast.error("Fehler beim Laden der Bachblüten-Mischungen");
    } finally {
      setLoading(false);
    }
  }

  const filteredData = React.useMemo(() => {
    return selections.filter((selection) => {
      if (!selection.client) return false;

      const clientName = selection.client
        ? `${selection.client.first_name ?? ""} ${selection.client.last_name ?? ""}`.toLowerCase()
        : "";
      const searchTerm = clientFilter.toLowerCase();
      const matchesClient = clientName.includes(searchTerm);

      const matchesDate = dateFilter
        ? format(new Date(selection.date), "yyyy-MM-dd") ===
          format(dateFilter, "yyyy-MM-dd")
        : true;

      return matchesClient && matchesDate;
    });
  }, [selections, clientFilter, dateFilter]);

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
        <div className="text-muted-foreground">Lade Blütenauswahlen...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blütenauswahlen</h1>
        <div className="text-sm text-muted-foreground">
          {filteredData.length} Auswahlen gefunden
        </div>
      </div>

      <SelectionFilters
        clientFilter={clientFilter}
        setClientFilter={setClientFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        onResetFilters={resetFilters}
      />

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
                  Keine Einträge gefunden
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
