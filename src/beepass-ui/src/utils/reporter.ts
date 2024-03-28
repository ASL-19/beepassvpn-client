import * as sentry from "@sentry/browser";

import { getSentryBrowserIntegrations } from "../../../www/app/error_reporter";

// TODO:
// 1. Set setUpUnhandledRejectionListener function in error boundary to catch and dispatch unexpected errors.

type ReportParams = {
  feedbackCategory: string;
  tags?: { [id: string]: string };
  userEmail?: string;
  userFeedback: string;
};

// Transform www/cordova_main class CordovaErrorReporter constructor function
export const initSentry = () => {
  sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: getSentryBrowserIntegrations,
    release: import.meta.env.VITE_APP_VERSION,
  });

  // ASL19: Disable native error reporting (we’re using Google Play Console and
  // Xcode for now)

  // pluginExec<void>(
  //   "initializeErrorReporting",
  //   import.meta.env.VITE_SENTRY_DSN,
  // );
};

// Transform class CordovaErrorReporter report function
const report = async ({
  feedbackCategory,
  tags,
  userEmail,
  userFeedback,
}: ReportParams) => {
  sentry.captureEvent({
    message: userFeedback,
    tags: { category: feedbackCategory },
    user: { email: userEmail },
  });
  sentry.configureScope((scope) => {
    scope.setUser({ email: userEmail || "" });
    // tags param is used for set build.number, only set build.number when environment is not browser.
    if (tags) {
      scope.setTags(tags);
    }
    scope.setTag("category", feedbackCategory);
  });
  sentry.captureMessage(userFeedback);
  sentry.configureScope((scope) => {
    scope.clear();
  });
};

// Transform www/cordova_main class CordovaPlatform getErrorReporter logic
export const cordovaReport = async (params: ReportParams) => {
  const paramsWithBuildNumber: ReportParams = {
    ...params,
    tags: {
      ...params.tags,
      ...(window.cordova
        ? {
            "build.number": import.meta.env.VITE_APP_VERSION,
          }
        : {}),
    },
  };

  await report(paramsWithBuildNumber);
  // ASL19: Disable native error reporting (we’re using Google Play Console and
  // Xcode for now)

  // await pluginExec<void>("reportEvents", sentry.lastEventId() || "");
};
