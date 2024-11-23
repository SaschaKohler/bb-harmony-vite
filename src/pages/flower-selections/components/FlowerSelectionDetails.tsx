import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

const FlowerSelectionDetails = ({ selection }) => {
  // Berechne Enddatum
  const startDate = new Date(selection.date);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + selection.duration_weeks * 7);

  return (
    <div className="space-y-4 p-4">
      {/* Header mit Kerninfos */}
      <div className="flex justify-between items-start border-b pb-3">
        <div>
          <h3 className="font-semibold">
            {selection.client.first_name} {selection.client.last_name}
          </h3>
          <div className="text-sm text-muted-foreground space-x-2">
            <span>{format(startDate, "dd.MM.yyyy", { locale: de })}</span>
            <span>-</span>
            <span>{format(endDate, "dd.MM.yyyy", { locale: de })}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {selection.duration_weeks} Wochen
            </span>
          </div>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
              selection.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800",
            )}
          >
            {selection.status === "active" ? "Aktiv" : "Abgeschlossen"}
          </span>
        </div>
      </div>

      {/* Blütenliste */}
      <div className="grid grid-cols-2 gap-2 ">
        {selection.selection_flowers
          .sort((a, b) => a.position - b.position)
          .map((sf) => (
            <div
              key={sf.flower.id}
              className="flex items-center gap-2 p-2  rounded-md border bg-muted"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm font-medium text-accent-foreground whitespace-nowrap">
                    Nr.{sf.flower.number}
                  </span>
                  <span className="text-sm font-medium truncate">
                    {sf.flower.name_english}
                  </span>
                </div>
                <span
                  className="text-xs text-accent-foreground block truncate"
                  title={sf.flower.name_german}
                >
                  {sf.flower.name_german}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* Notizen */}
      {selection.notes && (
        <div className="mt-4 pt-3 border-t">
          <h4 className="text-sm font-medium text-muted-foreground mb-1">
            Notizen
          </h4>
          <p className="text-sm whitespace-pre-wrap">{selection.notes}</p>
        </div>
      )}
    </div>
  );
};

export default FlowerSelectionDetails;
