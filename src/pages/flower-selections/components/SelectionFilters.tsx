import React from "react";
import { Search } from "lucide-react";
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
  dateFilter: Date | undefined;
  setDateFilter: (date: Date | undefined) => void;
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
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6 space-y-4">
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
                  "w-[240px] justify-start text-left font-normal",
                  !dateFilter && "text-muted-foreground",
                )}
              >
                {dateFilter ? (
                  format(dateFilter, "PP", { locale: de })
                ) : (
                  <span>Datum wählen</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                locale={de}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Reset Button */}
        <Button
          variant="ghost"
          onClick={onResetFilters}
          className="w-full sm:w-auto"
        >
          Filter zurücksetzen
        </Button>
      </div>
    </div>
  );
}
