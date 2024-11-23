import React, { useState, useMemo } from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BachFlowerLibraryProps {
  flowers: Array<{
    id: string;
    name_english: string;
    name_german: string;
    name_latin: string;
    affirmation: string;
    emotion_group: string;
    description: string;
    number: number;
  }>;
}

export default function BachFlowerLibrary({ flowers }: BachFlowerLibraryProps) {
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"number" | "name">("number");

  const filteredFlowers = useMemo(() => {
    return flowers
      .filter((flower) => {
        const matchesSearch =
          flower.name_english.toLowerCase().includes(search.toLowerCase()) ||
          flower.name_german.toLowerCase().includes(search.toLowerCase());
        const matchesEmotion =
          emotionFilter === "all" || flower.emotion_group === emotionFilter;
        return matchesSearch && matchesEmotion;
      })
      .sort((a, b) => {
        if (sortBy === "number") return a.number - b.number;
        return a.name_english.localeCompare(b.name_english);
      });
  }, [flowers, search, emotionFilter, sortBy]);

  const emotionGroups = useMemo(
    () => Array.from(new Set(flowers.map((f) => f.emotion_group))),
    [flowers],
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Suche</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nach Namen suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <label className="text-sm font-medium">Gefühlsgruppe</label>
          <Select value={emotionFilter} onValueChange={setEmotionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Alle Gruppen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Gruppen</SelectItem>
              {emotionGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <label className="text-sm font-medium">Sortierung</label>
          <Select
            value={sortBy}
            onValueChange={(value: "number" | "name") => setSortBy(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sortieren nach" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="number">Nummer</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFlowers.map((flower) => (
          <Card
            key={flower.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={`/images/blossoms/${flower.name_english.toLowerCase().replace(/\s+/g, "_")}.png`}
                  alt={flower.name_english}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardTitle className="flex items-center justify-between">
                <span>{flower.name_english}</span>
                <span className="text-sm text-muted-foreground">
                  #{flower.number}
                </span>
              </CardTitle>
              <CardDescription>
                {flower.name_german} • {flower.name_latin}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-1">Gefühlsgruppe</h4>
                <p className="text-sm text-muted-foreground">
                  {flower.emotion_group}
                </p>
              </div>
              {flower.affirmation && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Affirmation</h4>
                  <p className="text-sm italic">{flower.affirmation}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold mb-1">Beschreibung</h4>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {flower.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
