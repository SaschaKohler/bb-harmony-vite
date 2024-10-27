import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Database } from "../types/supabase";
import {
  Table,
  TableBody,
  TableCaption,
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
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type Client = Database["public"]["Tables"]["clients"]["Row"];

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => `${row.original.first_name} ${row.original.last_name}`,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Telefon",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div>
        <Button
          variant="outline"
          className="mr-2"
          onClick={() => console.log("Edit", row.original.id)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          onClick={() => console.log("Delete", row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

export default function ClientListPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("last_name", { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      // Here you might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  }

  const table = useReactTable({
    data: clients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (loading) {
    return <div>Loading clients...</div>;
  }
  console.log(clients);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Kundenliste</h1>
      <Table>
        <TableCaption>Eine Liste aller Kunden</TableCaption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
