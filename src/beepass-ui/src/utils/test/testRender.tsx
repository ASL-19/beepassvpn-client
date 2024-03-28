import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement, Suspense } from "react";
import { HashRouter } from "react-router-dom";

import AppProvider from "src/components/AppProvider";
import { AppState, Language, Server } from "src/stores/appStore";
import enStrings from "src/strings/enStrings";
import faStrings from "src/strings/faStrings";
import serverTestDataById from "src/testData/serverTestDataById";
import { setLocalStorageValue } from "src/utils/localStorage";

export type MockAppStateOverrides = {
  language?: Language;
  servers?: Array<Server>;
};

/**
 * Return mocked app state for testing
 *
 * @param localeCode -language localeCode ("en" | "fa")
 * @param config -allow user to pass customized app state
 */
const getMockAppState = (overrides: MockAppStateOverrides = {}): AppState => {
  const language = overrides.language ?? "en";

  return {
    language,
    messageInfos: [],
    servers: overrides.servers ?? Object.values(serverTestDataById),
    strings: language === "fa" ? faStrings : enStrings,
  };
};

/**
 * Render provided `element` using `@testing-library/react`’s `render`,
 * returning `RenderResult` and `user` (`UserEvent`).
 */
const testRender = async ({
  element,
  elementIsWrappedInHashRouter,
  mockAppStateOverrides,
  onboardingCompleted = true,
}: {
  /**
   * Element to render.
   */
  element: ReactElement;
  /**
   * Is the provided `element` already wrapped in `<HashRouter>`?
   *
   * This is probably only true if `element: <App />`.
   */
  elementIsWrappedInHashRouter?: boolean;
  /**
   * Overrides for AppProvider initial state.
   */
  mockAppStateOverrides?: MockAppStateOverrides;
  /**
   * Is onboarding completed?
   *
   * Defaults to `true`.
   */
  onboardingCompleted?: boolean;
}) => {
  if (onboardingCompleted) {
    setLocalStorageValue({ key: "onboardingCompleted", value: true });
  }

  const mockAppState = getMockAppState(mockAppStateOverrides);

  const elementWithAppProvider = (
    <AppProvider {...mockAppState}>
      <Suspense fallback={<div>loading</div>}>{element} </Suspense>
    </AppProvider>
  );

  // userEvent.setup should be called before render
  // (https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent)
  return {
    user: userEvent.setup(),

    // TODO: Can we refactor e.g. syncCordovaServerConnectivityState to remove
    // the need for act() here?
    //
    // eslint-disable-next-line testing-library/no-unnecessary-act
    ...(await act(() =>
      render(
        elementIsWrappedInHashRouter ? (
          elementWithAppProvider
        ) : (
          <HashRouter>{elementWithAppProvider}</HashRouter>
        ),
      ),
    )),
  };
};

export default testRender;
