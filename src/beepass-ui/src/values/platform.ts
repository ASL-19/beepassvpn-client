import { cordova } from "src/utils/cordova";
import matchConst from "src/utils/matchConst";

const cordovaPlatformId =
  "cordova" in window ? (cordova.platformId as string) : null;

export const platformSlug =
  cordovaPlatformId === "android"
    ? "android"
    : cordovaPlatformId === "ios"
    ? "ios"
    : cordovaPlatformId === "osx"
    ? "macos"
    : // This isn’t safe if we add Linux!
    "electron" in window
    ? "windows"
    : "browser";

/**
 * Does this platform’s native code consistently send a connected event?
 *
 * The Apple `cordova-plugin-outline` doesn’t consistently send the connected
 * event so we call in `setServerStartTimeLocalStorageValueToNow` and
 * `openLandingPage` in a conditional block in `cordovaConnectToServer` instead.
 */
export const platformConsistentlySendsConnectedEvent = matchConst(platformSlug)
  .with("android", "browser", "windows", () => true)
  .with("ios", "macos", () => false)
  .exhaustive();
