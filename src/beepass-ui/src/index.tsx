import { Global } from "@emotion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

import globalStyles from "src/style/globalStyles";
import { getLocalStorageValue } from "src/utils/localStorage";
import { migrationLocalStorageKey } from "src/utils/migrationLocalStorageKey";
import { initSentry } from "src/utils/reporter";
import updateDocumentAttributes from "src/utils/updateDocumentAttributes";

const renderReactDom = () => {
  const container = document.getElementById("root");
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <Global styles={globalStyles} />
      <App />
    </StrictMode>,
  );
};

const init = () => {
  const localeCode = getLocalStorageValue({ key: "language" });

  // Update the document direction before rendering so that it’s set correctly
  // before anything is committed to the DOM. Otherwise RTL could monetarily be
  // displayed as LTR before the direction updating effect runs.
  updateDocumentAttributes(localeCode);

  console.info("Starting with env:", {
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    VITE_BUILD_TYPE: import.meta.env.VITE_BUILD_TYPE,
    VITE_DEFAULT_ACCESS_KEY: import.meta.env.VITE_DEFAULT_ACCESS_KEY,
    VITE_ENABLE_FEEDBACK_PAGE: import.meta.env.VITE_ENABLE_FEEDBACK_PAGE,
    VITE_LANDING_PAGE_ENDPOINT: import.meta.env.VITE_LANDING_PAGE_ENDPOINT,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  });

  renderReactDom();
  initSentry();
};

// Only for testing localStorage key migration
// setUpPolymerLocalStorage({
//   overrideLanguage: "fa",
//   onboardingComplete: true,
//   autoConnectDialogDismissed: false,
// });

// migrate polymer version localStorage key to React version
migrationLocalStorageKey();

// when cordova ready, render frontend.
if ("cordova" in window) {
  document.addEventListener("deviceready", init, false);
} else {
  init();
}
