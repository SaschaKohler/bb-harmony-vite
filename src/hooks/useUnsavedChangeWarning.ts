import { useEffect } from "react";
import { useBeforeUnload } from "react-use";

export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  // Warnung beim Verlassen der Seite
  useBeforeUnload(
    hasUnsavedChanges,
    "Es gibt ungespeicherte Änderungen. Möchten Sie die Seite wirklich verlassen?",
  );

  // Warnung beim Routing (React Router)
  useEffect(() => {
    const handleBeforeNavigate = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          "Es gibt ungespeicherte Änderungen. Möchten Sie die Seite wirklich verlassen?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeNavigate);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeNavigate);
  }, [hasUnsavedChanges]);
}
