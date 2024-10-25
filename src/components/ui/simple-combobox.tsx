import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDown, PlusCircle } from "lucide-react";
import type { Database } from "@/types/supabase";

type Client = Database["public"]["Tables"]["clients"]["Row"];

interface SimpleComboboxProps {
  clients: Client[];
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
  setIsNewClient: (value: boolean) => void;
  isLoading: boolean;
}

export const SimpleCombobox: React.FC<SimpleComboboxProps> = ({
  clients,
  selectedClient,
  setSelectedClient,
  setIsNewClient,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter((client) =>
    `${client.first_name} ${client.last_name} ${client.email || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {selectedClient
            ? `${selectedClient.first_name} ${selectedClient.last_name}`
            : "Kunde auswählen..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-2">
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Kunde suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="max-h-[300px] overflow-y-auto rounded-md border">
            {isLoading ? (
              <div className="p-4 text-sm text-center text-muted-foreground">
                Lade Kunden...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="p-4 text-sm text-center text-muted-foreground">
                Keine Kunden gefunden
              </div>
            ) : (
              <div className="flex flex-col">
                {filteredClients.map((client) => (
                  <Button
                    key={client.id}
                    variant="ghost"
                    className="justify-start px-4 py-2 w-full"
                    onClick={() => {
                      setSelectedClient(client);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedClient?.id === client.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {client.first_name} {client.last_name}
                        </p>
                        {client.email && (
                          <p className="text-xs text-muted-foreground">
                            {client.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => {
              setIsNewClient(true);
              setIsOpen(false);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Neuen Kunden anlegen
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
