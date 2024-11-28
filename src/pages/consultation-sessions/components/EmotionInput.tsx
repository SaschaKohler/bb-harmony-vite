import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useEmotionRecommendations } from "@/hooks/useEmotionRecommendations";
import { cn } from "@/lib/utils";

interface EmotionInputProps {
  value: string[];
  onChange: (emotions: string[]) => void;
  onBlur?: () => void;
}

export function EmotionInput({ value, onChange, onBlur }: EmotionInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { suggestions, isLoading } = useEmotionRecommendations({
    searchTerm: inputValue,
    excludeTerms: value,
    maxSuggestions: 8,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (inputValue.trim()) {
        if (suggestions.length > 0) {
          const newTerm = suggestions[0].name;
          if (!value.includes(newTerm)) {
            onChange([...value, newTerm]);
          }
        } else if (!value.includes(inputValue.trim())) {
          onChange([...value, inputValue.trim()]);
        }
        setInputValue("");
      }
    }
  };

  const handleRemoveTerm = (termToRemove: string) => {
    onChange(value.filter((e) => e !== termToRemove));
  };

  const handleSelectSuggestion = (suggestion: (typeof suggestions)[number]) => {
    if (!value.includes(suggestion.name)) {
      onChange([...value, suggestion.name]);
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      {/* Ausgewählte Begriffe */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((term, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {term}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => handleRemoveTerm(term)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Eingabefeld */}
      <div className="relative">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 200);
            onBlur?.();
          }}
          placeholder={
            value.length === 0
              ? "Beschreiben Sie die wahrgenommenen emotionalen Zustände..."
              : "Weitere Zustände hinzufügen..."
          }
          className="resize-none"
        />

        {/* Vorschläge */}
        {isFocused && inputValue && suggestions.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-popover border rounded-md shadow-md z-10 max-h-[300px] overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                className={cn(
                  "w-full text-left px-3 py-2 hover:bg-accent flex flex-col",
                  index === 0 && "rounded-t-md",
                  index === suggestions.length - 1 && "rounded-b-md",
                )}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{suggestion.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type === "emotion" ? "Emotion" : "Symptom"}
                  </Badge>
                </div>
                {(suggestion.description || suggestion.groupName) && (
                  <div className="text-muted-foreground text-sm space-y-1">
                    {suggestion.groupName && (
                      <div className="text-xs">
                        Kategorie: {suggestion.category} -{" "}
                        {suggestion.groupName}
                      </div>
                    )}
                    {suggestion.description && (
                      <div>{suggestion.description}</div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
