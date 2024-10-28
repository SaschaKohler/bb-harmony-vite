import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FlaskRound,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format, subDays } from "date-fns";
import { de } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RecentSelectionsTable } from "./components/RecentSelectionsTable";
import { ActiveClientsTable } from "./components/ActiveClientsTable";

interface DashboardStats {
  totalClients: number;
  totalSelections: number;
  activeSelections: number;
  clientsThisMonth: number;
  selectionsThisMonth: number;
  clientsLastMonth: number;
  selectionsLastMonth: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalSelections: 0,
    activeSelections: 0,
    clientsThisMonth: 0,
    selectionsThisMonth: 0,
    clientsLastMonth: 0,
    selectionsLastMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Datum-Filter für Monatsvergleiche
      const today = new Date();
      const firstDayThisMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      );
      const firstDayLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      const lastDayLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
      );

      // Gesamtzahlen
      const { count: totalClients } = await supabase
        .from("clients")
        .select("*", { count: "exact" });

      const { count: totalSelections } = await supabase
        .from("flower_selections")
        .select("*", { count: "exact" });

      // Aktive Auswahlen
      const { count: activeSelections } = await supabase
        .from("flower_selections")
        .select("*", { count: "exact" })
        .gte("date", subDays(new Date(), 28).toISOString())
        .eq("status", "active");

      // Neue Klienten diesen Monat
      const { count: clientsThisMonth } = await supabase
        .from("clients")
        .select("*", { count: "exact" })
        .gte("created_at", firstDayThisMonth.toISOString());

      // Neue Klienten letzten Monat
      const { count: clientsLastMonth } = await supabase
        .from("clients")
        .select("*", { count: "exact" })
        .gte("created_at", firstDayLastMonth.toISOString())
        .lt("created_at", firstDayThisMonth.toISOString());

      // Auswahlen diesen Monat
      const { count: selectionsThisMonth } = await supabase
        .from("flower_selections")
        .select("*", { count: "exact" })
        .gte("date", firstDayThisMonth.toISOString());

      // Auswahlen letzten Monat
      const { count: selectionsLastMonth } = await supabase
        .from("flower_selections")
        .select("*", { count: "exact" })
        .gte("date", firstDayLastMonth.toISOString())
        .lt("date", firstDayThisMonth.toISOString());

      setStats({
        totalClients: totalClients || 0,
        totalSelections: totalSelections || 0,
        activeSelections: activeSelections || 0,
        clientsThisMonth: clientsThisMonth || 0,
        selectionsThisMonth: selectionsThisMonth || 0,
        clientsLastMonth: clientsLastMonth || 0,
        selectionsLastMonth: selectionsLastMonth || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-muted-foreground">Lade Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Übersicht über Ihre Praxisaktivitäten
          </p>
        </div>
        <Button onClick={() => navigate("/bachbluten-rad")}>
          Neue Blütenauswahl
        </Button>
      </div>

      {/* Statistik-Karten */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Klienten</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center">
                {calculateGrowth(
                  stats.clientsThisMonth,
                  stats.clientsLastMonth,
                ) > 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                {Math.abs(
                  calculateGrowth(
                    stats.clientsThisMonth,
                    stats.clientsLastMonth,
                  ),
                ).toFixed(1)}
                %
              </span>
              <span className="ml-2">seit letztem Monat</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktive Auswahlen
            </CardTitle>
            <FlaskRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSelections}</div>
            <p className="text-xs text-muted-foreground">
              von insgesamt {stats.totalSelections} Auswahlen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Neue Auswahlen
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.selectionsThisMonth}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="flex items-center">
                {calculateGrowth(
                  stats.selectionsThisMonth,
                  stats.selectionsLastMonth,
                ) > 0 ? (
                  <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                )}
                {Math.abs(
                  calculateGrowth(
                    stats.selectionsThisMonth,
                    stats.selectionsLastMonth,
                  ),
                ).toFixed(1)}
                %
              </span>
              <span className="ml-2">seit letztem Monat</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durchschnitt</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalClients > 0
                ? (stats.totalSelections / stats.totalClients).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Auswahlen pro Klient
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabellen */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Neueste Auswahlen</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSelectionsTable />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktive Klienten</CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveClientsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
