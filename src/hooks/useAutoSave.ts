import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
}: AutoSaveOptions<T>) {
  const [isSaving, setIsSaving] = useState(false);
  const previousDataRef = useRef<T>(data);
  const debouncedData = useDebounce(data, debounceMs);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const save = useCallback(
    async (dataToSave: T) => {
      if (!enabled) return;

      try {
        setIsSaving(true);
        await onSave(dataToSave);
        previousDataRef.current = dataToSave;
      } catch (error) {
        console.error("AutoSave error:", error);
        toast.error("Fehler beim Speichern");
      } finally {
        setIsSaving(false);
      }
    },
    [onSave, enabled],
  );

  useEffect(() => {
    // Vergleiche die Daten oberflächlich mit JSON.stringify
    const currentDataString = JSON.stringify(debouncedData);
    const previousDataString = JSON.stringify(previousDataRef.current);

    if (currentDataString !== previousDataString) {
      // Lösche existierenden Timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Setze neuen Timeout
      saveTimeoutRef.current = setTimeout(() => {
        save(debouncedData);
      }, debounceMs);
    }

    // Cleanup
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [debouncedData, save, debounceMs]);

  return { isSaving };
}
