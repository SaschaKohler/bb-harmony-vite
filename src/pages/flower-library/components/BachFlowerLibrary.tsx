// src/pages/flower-library/BachFlowerLibrary.tsx
import React, { useState, useMemo } from "react";
import { Search, Filter, SortAsc, Info, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EMOTION_GROUPS } from "@/pages/bachblueten-wizard/constants/emotion-groups";
import { FLOWER_TRANSFORMATIONS } from "@/data/flower-transformations";
import { getApplicationAreas } from "@/lib/bachblueten/helpers";

interface BachFlowerLibraryProps {
  flowers: Array<{
    id: string;
    name_english: string;
    name_german: string;
    name_latin: string;
    affirmation: string;
    description: string;
    number: number;
    emotion: {
      id: string;
      name: string;
      description: string;
      color: string;
    };
    flower_symptom_relations: Array<{
      id: string;
      symptom_id: string;
      is_primary: boolean;
      symptom?: {
        name: string;
      };
    }>;
  }>;
}

export default function BachFlowerLibrary({ flowers }: BachFlowerLibraryProps) {
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"number" | "name">("number");

  // Geändert: Nutze alle definierten Gefühlsgruppen
  const emotionGroups = useMemo(() => {
    return Object.entries(EMOTION_GROUPS).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  }, []);

  const filteredFlowers = useMemo(() => {
    return flowers
      .filter((flower) => {
        const matchesSearch =
          flower.name_english.toLowerCase().includes(search.toLowerCase()) ||
          flower.name_german.toLowerCase().includes(search.toLowerCase()) ||
          flower.name_latin?.toLowerCase().includes(search.toLowerCase());
        const matchesEmotion =
          emotionFilter === "all" ||
          (flower.emotion?.name &&
            flower.emotion.name.toLowerCase() === emotionFilter.toLowerCase());

        return matchesSearch && matchesEmotion;
      })
      .sort((a, b) => {
        if (sortBy === "number") return a.number - b.number;
        return a.name_english.localeCompare(b.name_english);
      });
  }, [flowers, search, emotionFilter, sortBy]);

  const getPrimarySymptoms = (flower: BachFlowerLibraryProps["flowers"][0]) => {
    return flower.flower_symptom_relations
      .filter((rel) => rel.is_primary)
      .map((rel) => rel.symptom?.name)
      .filter(Boolean);
  };

  const getSpecificSymptoms = (flower: BachFlowerLibraryProps): string[] => {
    // Hole nur die spezifischen Symptome dieser Blüte
    const primarySymptoms = flower.flower_symptom_relations
      .filter((rel) => rel.is_primary && rel.symptom)
      .map((rel) => rel.symptom?.name)
      .filter((symptom): symptom is string => Boolean(symptom));

    // Entferne allgemeine Gruppenbeschreibungen
    return primarySymptoms.filter(
      (symptom) =>
        !symptom.toLowerCase().includes("diese gruppe hilft bei") &&
        !symptom.toLowerCase().includes("die blüten in dieser gruppe"),
    );
  };
  const getTransformationText = (flowerName: string) => {
    const transformation =
      FLOWER_TRANSFORMATIONS[flowerName.toLowerCase().replace(/\s+/g, "_")];
    if (transformation) {
      return `Von ${transformation.from} zu ${transformation.to}`;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Filter-Bereich */}
      <div className="flex flex-col md:flex-row gap-4 items-end bg-white p-4 rounded-lg shadow-sm">
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
                <SelectItem key={group.id} value={group.id}>
                  {group.id}
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

      {/* Blüten-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFlowers.map((flower) => {
          const emotionGroup =
            EMOTION_GROUPS[flower.emotion?.name as keyof typeof EMOTION_GROUPS];
          const transformation = getTransformationText(flower.name_english);
          const primarySymptoms = getPrimarySymptoms(flower);

          return (
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
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {flower.name_english}
                    <span className="ml-2 text-sm text-muted-foreground">
                      #{flower.number}
                    </span>
                  </CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs space-y-2">
                      {transformation && (
                        <p className="font-medium flex items-center gap-2">
                          {transformation}
                          <ArrowRight className="h-4 w-4" />
                        </p>
                      )}
                      {primarySymptoms.length > 0 && (
                        <div>
                          <p className="font-medium">Primäre Symptome:</p>
                          <ul className="list-disc list-inside">
                            {primarySymptoms.map((symptom) => (
                              <li key={symptom} className="text-sm">
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <CardDescription className="space-y-2">
                  <p>{flower.name_german}</p>
                  <p className="italic text-sm">{flower.name_latin}</p>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Gefühlsgruppe</h4>
                  {emotionGroup && (
                    <Badge
                      className="font-medium"
                      style={{
                        backgroundColor: emotionGroup.bgColor,
                        color: emotionGroup.textColor,
                        borderColor: emotionGroup.borderColor,
                      }}
                    >
                      {flower.emotion.name}
                    </Badge>
                  )}
                </div>

                {flower.affirmation && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Affirmation</h4>
                    <p className="text-sm italic">{flower.affirmation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
