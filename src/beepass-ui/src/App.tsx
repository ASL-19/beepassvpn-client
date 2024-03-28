import "overlayscrollbars/overlayscrollbars.css";

import { css } from "@emotion/react";
import { Suspense, useEffect } from "react";
import { lazy } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";

import AppProvider from "./components/AppProvider";
import MessageModal from "./components/MessageModal";
import Header from "./components/navigator/Header";
import Redirect from "./components/Redirect";

import { useGlobalListener } from "src/hooks/useGlobalListener";
import useLoadOverlayScrollbarsComponent from "src/hooks/useLoadOverlayScrollbarsComponent";
import { useAppOverlayScrollbarsComponent } from "src/stores/appStore";

const AboutPage = lazy(() => import("src/pages/AboutPage"));
const FeedbackPage = lazy(() => import("src/pages/FeedbackPage"));
const HelpPage = lazy(() => import("src/pages/HelpPage"));
const LanguagePage = lazy(() => import("src/pages/LanguagePage"));
const ServersPage = lazy(() => import("src/pages/ServersPage"));
const LicensesPage = lazy(() => import("src/pages/LicensesPage/LicensesPage"));

const navigation = css`
  flex: 0 0 auto;
`;

const BeepassUIApp = () => {
  useGlobalListener();
  useLoadOverlayScrollbarsComponent();

  const OverlayScrollbars = useAppOverlayScrollbarsComponent();

  useEffect(() => {
    if (OverlayScrollbars !== undefined) {
      // navigator.splashscreen only exists on Cordova macOS and Cordova iOS
      // (not Cordova macOS or Electron) so we need to use optional chaining to
      // avoid runtime errors.
      navigator.splashscreen?.hide();
    }
  }, [OverlayScrollbars]);

  if (OverlayScrollbars === undefined) {
    return <></>;
  }

  return (
    <>
      {/* Only HashRouter can work with Cordova

      See https://medium.com/@pshubham/using-react-with-cordova-f235de698cc3 */}
      <HashRouter>
        <Header css={navigation} />
        <Routes>
          <Route path="/" element={<Redirect to="/servers" />} />
          <Route path="/servers" element={<ServersPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/language" element={<LanguagePage />} />
          <Route path="/licenses" element={<LicensesPage />} />
        </Routes>
      </HashRouter>
      <MessageModal />
    </>
  );
};

const App = () => (
  <AppProvider>
    <Suspense>
      <BeepassUIApp />
    </Suspense>
  </AppProvider>
);

export default App;
