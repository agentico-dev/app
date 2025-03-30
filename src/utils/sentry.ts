
import * as Sentry from '@sentry/react';

// Initialize Sentry
export const initSentry = () => {
  // Only initialize in production to avoid sending development errors
  // if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.replayIntegration()
      ],
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      tracesSampleRate: 0.5,
      // Capture Replay for errors only
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  // }
};
