import React, { Component, ReactNode } from 'react';

// Define the state interface for the ErrorBoundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Define the props interface. This will accept children as a ReactNode (the default type for children)
interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Initialize state with default values
    this.state = { hasError: false, error: null };
  }

  // Lifecycle method to update state when an error is thrown
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  // Lifecycle method to catch errors and log them
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    // If an error has been caught, display an error message
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button onClick={() => window.location.reload()} className="primary">
            Refresh Page
          </button>
        </div>
      );
    }

    // Otherwise, render the children components
    return this.props.children;
  }
}

export default ErrorBoundary;
