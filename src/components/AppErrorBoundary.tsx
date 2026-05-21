import { Component, ErrorInfo, ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App render failed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="min-h-screen bg-charcoal px-6 py-10 text-white">
          <div className="mx-auto max-w-2xl rounded-lg border border-red-400/30 bg-red-950/30 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-red-200">
              App failed to render
            </p>
            <h1 className="mt-2 text-2xl font-bold">Something crashed on this page.</h1>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded bg-black/30 p-4 text-sm text-red-100">
              {this.state.error.message}
            </pre>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
