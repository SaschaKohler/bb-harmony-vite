import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BachFlowersList } from "./components/BachFlowersList";
import { SectorsList } from "./components/SectorsList";
import { Shield, Flower2, CircleDot } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Administration</h1>
      </div>

      <Tabs defaultValue="flowers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="flowers" className="flex items-center gap-2">
            <Flower2 className="h-4 w-4" />
            Bachblüten
          </TabsTrigger>
          <TabsTrigger value="sectors" className="flex items-center gap-2">
            <CircleDot className="h-4 w-4" />
            Harmoniekreis-Sektoren
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flowers">
          <BachFlowersList />
        </TabsContent>

        <TabsContent value="sectors">
          <SectorsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
