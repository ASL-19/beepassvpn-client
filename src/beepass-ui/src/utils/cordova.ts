import matchConst from "src/utils/matchConst";
import setServerStartTimeLocalStorageValueToNow from "src/utils/setServerStartTimeLocalStorageValueToNow";
import setTestSafeTimeout from "src/utils/setTestSafeTimeout";
import { OUTLINE_PLUGIN_NAME } from "src/values/serverValues";

// Regarding to outline plugin actions
export type CordovaActionName =
  | "stop"
  | "start"
  | "quitApplication"
  | "onStatusChange"
  | "isRunning"
  | "isServerReachable";

type CordovaExecParameters = Parameters<typeof window.cordova.exec>;

class MockCordova {
  platformId = "web";

  exec(
    success: CordovaExecParameters[0],
    fail: CordovaExecParameters[1],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    service = OUTLINE_PLUGIN_NAME,
    action: CordovaActionName,
    args?: CordovaExecParameters[4],
  ) {
    console.info(`[MockCordova] exec "${action}" with args:`, args);

    matchConst(action)
      .with("isRunning", () => {
        return setTestSafeTimeout(() => success(false), 200);
      })
      .with("isServerReachable", () => {
        return setTestSafeTimeout(() => success(true), 500);
      })
      .with("stop", () => {
        return setTestSafeTimeout(() => success(null), 500);
      })
      .with("start", () => {
        // start the timer
        setServerStartTimeLocalStorageValueToNow();
        return setTestSafeTimeout(() => {
          success(null);
        }, 1000);
      })
      .with("quitApplication", () => {
        console.info("[MockCordova] quitApplication action isn’t mocked");
      })
      .with("onStatusChange", () => {
        console.info("[MockCordova] onStatusChange action isn’t mocked");
      })
      .exhaustive();
  }
}

export const cordova: Cordova | MockCordova =
  import.meta.env.VITE_BUILD_TYPE === "cordova-mock"
    ? new MockCordova()
    : window.cordova;
