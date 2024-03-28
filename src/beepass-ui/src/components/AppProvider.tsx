import { FC, memo, ReactNode, useMemo } from "react";

import AddServerModalProvider from "../hooks/useAddServerModalContext";
import ErrorBoundary from "./ErrorBoundary";

import OnboardingProvider, {
  OnboardingProviderContextProps,
} from "src/hooks/useOnboardingContext";
import { AppState, AppStoreProvider, Language } from "src/stores/appStore";
import enStrings from "src/strings/enStrings";
import faStrings from "src/strings/faStrings";
import getPersistedServers from "src/utils/getPersistedServers";
import { getLocalStorageValue } from "src/utils/localStorage";
import matchConst from "src/utils/matchConst";

export type AppProviderProps = {
  children: ReactNode;
  onBoardingState?: OnboardingProviderContextProps;
} & Partial<AppState>;

const AppProvider: FC<AppProviderProps> = memo(
  ({ children, onBoardingState, ...appState }) => {
    const strings =
      (getLocalStorageValue({
        key: "language",
      }) || "fa") === "fa"
        ? faStrings
        : enStrings;

    const initialAppState = useMemo<AppState>(() => {
      const persistedServers = getPersistedServers();

      return {
        language: (getLocalStorageValue({
          key: "language",
        }) || "en") as Language,
        messageInfos: [],
        servers: persistedServers.map((server) => ({
          ...server,
          connectionState: matchConst(import.meta.env.VITE_BUILD_TYPE)
            .with("cordova-mock", "cordova-native", () => null)
            .with("electron-mock", "electron-native", () => "disconnected")
            .exhaustive(),
        })),
        strings,
        ...appState,
      };
    }, [appState, strings]);

    return (
      <ErrorBoundary>
        <AppStoreProvider initialState={initialAppState}>
          <AddServerModalProvider>
            <OnboardingProvider initialState={onBoardingState}>
              {children}
            </OnboardingProvider>
          </AddServerModalProvider>
        </AppStoreProvider>
      </ErrorBoundary>
    );
  },
);

AppProvider.displayName = "AppProvider";

export default AppProvider;
