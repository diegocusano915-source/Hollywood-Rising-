import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside game boundary:', error, errorInfo);
  }

  private handleRecover = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-screen bg-[#070712] text-white flex flex-col items-center justify-center p-6 select-none text-center">
          <div className="max-w-md w-full bg-[#0F1022] border border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-4 text-amber-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2">
              Simulation Shielded
            </h2>
            <p className="text-xs text-gray-300 font-medium mb-6 leading-relaxed">
              An unexpected display glitch occurred, but your game save data is safe and updated.
            </p>
            <button
              onClick={this.handleRecover}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-300 text-black font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Resume Game</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
