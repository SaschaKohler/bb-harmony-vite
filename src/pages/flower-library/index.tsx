// src/pages/flower-library/index.tsx
import { useBachFlowers } from "./hooks/useBachFlowers";
import BachFlowerLibrary from "./components/BachFlowerLibrary";
import { Loader2 } from "lucide-react";

export default function FlowerLibraryPage() {
  const { data: flowers, isLoading, error } = useBachFlowers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading flowers: {error.message}
      </div>
    );
  }

  return <BachFlowerLibrary flowers={flowers || []} />;
}
