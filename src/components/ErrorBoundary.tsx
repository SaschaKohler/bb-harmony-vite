// ErrorBoundary.tsx
import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-md bg-red-50 border border-red-200">
          <h2 className="text-lg font-medium text-red-800">
            Ein Fehler ist aufgetreten
          </h2>
          <p className="text-sm text-red-600">
            Bitte laden Sie die Seite neu oder kontaktieren Sie den Support.
          </p>
          <button
            className="mt-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-500"
            onClick={() => this.setState({ hasError: false })}
          >
            Neu laden
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
