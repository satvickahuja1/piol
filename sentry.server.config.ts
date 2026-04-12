// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://c24dc3c5b8e0f68b22126a3826184e41@o4511205164449792.ingest.us.sentry.io/4511205328093184",

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  integrations : [
    Sentry.vercelAIIntegration({
      recordInputs : true,
      recordOutputs : true
    }),
    Sentry.consoleLoggingIntegration({levels : ['info' , 'trace' , 'error' , 'log']})
  ],

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
