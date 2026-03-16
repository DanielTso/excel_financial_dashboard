"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component for catching React errors
 * Use this to wrap data-fetching components or critical UI sections
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="bg-negative-bg border border-negative/20 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-negative" size={24} />
              <h2 className="text-lg font-semibold text-foreground">
                Something went wrong
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              We encountered an error while loading this section. Please try
              again or refresh the page.
            </p>

            {this.state.error && process.env.NODE_ENV === "development" && (
              <pre className="bg-background p-3 rounded text-xs text-negative overflow-auto max-h-32 mb-4">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="flex-1"
              >
                Try Again
              </Button>
              <Button
                onClick={this.handleReload}
                className="flex-1 bg-steel-blue hover:bg-steel-blue/90"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Simple error fallback for use with ErrorBoundary
 */
export function ErrorFallback({
  message = "Failed to load data",
}: {
  message?: string;
}) {
  return (
    <div className="p-6 bg-negative-bg border border-negative/20 rounded-lg">
      <div className="flex items-center gap-2">
        <AlertCircle className="text-negative" size={18} />
        <span className="text-sm font-medium text-negative">{message}</span>
      </div>
    </div>
  );
}
