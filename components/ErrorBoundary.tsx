'use client';

import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { HiExclamationTriangle, HiArrowPath } from 'react-icons/hi2';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex items-center justify-center bg-[#050508] p-8"
          >
            <div className="glass-panel rounded-2xl p-8 max-w-lg w-full text-center border border-red-500/20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <HiExclamationTriangle className="w-10 h-10 text-red-400" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Council Disrupted</h2>
              <p className="text-gray-400 mb-6">
                An unexpected error occurred in the deliberation system.
              </p>
              
              {this.state.error && (
                <div className="bg-black/30 rounded-lg p-4 mb-6 text-left overflow-hidden">
                  <p className="text-red-300 text-sm font-mono mb-2">
                    {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-gray-500">
                      <summary className="cursor-pointer hover:text-gray-300">Stack trace</summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              
              <motion.button
                onClick={this.handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 mx-auto transition-colors"
              >
                <HiArrowPath className="w-4 h-4" />
                <span>Reconvene Council</span>
              </motion.button>
            </div>
          </motion.div>
        )
      );
    }

    return this.props.children;
  }
}