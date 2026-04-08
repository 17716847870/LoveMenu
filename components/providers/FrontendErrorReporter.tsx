"use client";

import { useEffect } from 'react';

function sendFrontendError(payload: Record<string, unknown>) {
  fetch('/api/error-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'frontend',
      ...payload,
    }),
  }).catch(() => {
    // ignore
  });
}

export default function FrontendErrorReporter() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      sendFrontendError({
        scope: 'window.error',
        path: window.location.pathname,
        message: event.message || 'Unknown frontend error',
        stack: event.error instanceof Error ? event.error.stack : undefined,
        url: window.location.href,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason instanceof Error
        ? reason.message
        : typeof reason === 'string'
          ? reason
          : 'Unhandled promise rejection';

      sendFrontendError({
        scope: 'window.unhandledrejection',
        path: window.location.pathname,
        message,
        stack: reason instanceof Error ? reason.stack : undefined,
        url: window.location.href,
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
