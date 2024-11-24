import { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  User,
  Mail,
  Phone,
  FlowerIcon,
  AlertCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionWithDetails } from "../types";

interface SessionDetailProps {
  session: SessionWithDetails | null;
  onClose: () => void;
  onStartSession: (sessionId: string) => void;
  onCompleteSession: (sessionId: string) => void;
}

export function SessionDetail({
  session,
  onClose,
  onStartSession,
  onCompleteSession,
}: SessionDetailProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!session) return null;

  const canStart = session.status === "scheduled";
  const canComplete = session.status === "in_progress";

  return (
    <Sheet open={!!session} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:w-[540px]">
        <SheetHeader className="space-y-4">
          <SheetTitle className="flex items-center justify-between">
            <span>Sitzungsdetails</span>
            {session.status && (
              <Badge
                variant={
                  session.status === "completed"
                    ? "success"
                    : session.status === "in_progress"
                      ? "secondary"
                      : "default"
                }
              >
                {statusLabels[session.status].label}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="protocol">Protokoll</TabsTrigger>
            <TabsTrigger value="flowers">Blüten</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Termindetails</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {format(
                      new Date(session.start_time),
                      "EEEE, d. MMMM yyyy",
                      { locale: de },
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {format(new Date(session.start_time), "HH:mm", {
                      locale: de,
                    })}{" "}
                    -
                    {format(new Date(session.end_time), "HH:mm", {
                      locale: de,
                    })}{" "}
                    Uhr
                  </span>
                </div>
                {session.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{session.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span>{sessionTypeLabels[session.session_type]}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Klienteninformationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {session.client.first_name} {session.client.last_name}
                  </span>
                </div>
                {session.client.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`mailto:${session.client.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {session.client.email}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {session.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notizen</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {session.notes}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 pt-4">
              {canStart && (
                <Button
                  className="flex-1"
                  onClick={() => onStartSession(session.id)}
                >
                  Sitzung starten
                </Button>
              )}
              {canComplete && (
                <Button
                  className="flex-1"
                  onClick={() => onCompleteSession(session.id)}
                >
                  Sitzung abschließen
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="protocol" className="mt-4">
            <SessionProtocol session={session} />
          </TabsContent>

          <TabsContent value="flowers" className="mt-4">
            <FlowerSelection session={session} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
