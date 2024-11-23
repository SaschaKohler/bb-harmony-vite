import React from "react";
import { CalendarIcon, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface SelectionFiltersProps {
  clientFilter: string;
  setClientFilter: (value: string) => void;
  dateFilter: DateFilter;
  setDateFilter: (date: DateFilter | undefined) => void;
  onResetFilters: () => void;
}

export function SelectionFilters({
  clientFilter,
  setClientFilter,
  dateFilter,
  setDateFilter,
  onResetFilters,
}: SelectionFiltersProps) {
  return (
    <div className="bg-background p-4 rounded-lg shadow-sm border mb-6 space-y-4">
      <h2 className="font-medium text-sm text-muted-foreground mb-3">Filter</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Klientensuche */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nach Klient suchen..."
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Datumsfilter */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateFilter.startDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter.startDate ? (
                  dateFilter.endDate ? (
                    <>
                      {format(dateFilter.startDate, "dd.MM.yyyy", {
                        locale: de,
                      })}{" "}
                      -
                      {format(dateFilter.endDate, "dd.MM.yyyy", { locale: de })}
                    </>
                  ) : (
                    format(dateFilter.startDate, "dd.MM.yyyy", { locale: de })
                  )
                ) : (
                  "Zeitraum wählen"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: dateFilter.startDate || undefined,
                  to: dateFilter.endDate || undefined,
                }}
                onSelect={(range) => {
                  setDateFilter({
                    startDate: range?.from || null,
                    endDate: range?.to || null,
                  });
                }}
                locale={de}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Reset Button */}
        {(clientFilter || dateFilter.startDate || dateFilter.endDate) && (
          <Button variant="ghost" onClick={onResetFilters} className="px-2">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
