/* eslint-disable no-param-reassign */
import { cleanEnv, str } from "envalid";
import fs from "fs";
import { loadEnv } from "vite";

import booleanString from "./booleanString";
import buildType from "./buildType";
import protocolAndHost from "./protocolAndHost";

const loadAndValidateEnvironmentVariables = ({ mode }: { mode: string }) => {
  const viteEnv = loadEnv(mode, process.cwd(), "");
  // --------------------------------------------------------------
  // --- Parse Android version code and version from config.xml ---
  // --------------------------------------------------------------

  if (mode !== "test") {
    const configXmlContent = fs.readFileSync("../../config.xml", "utf-8");

    const versionNumberMatches = configXmlContent.match(
      /<widget.*version="(?<version>[\d.]+)".*android-versionCode="(?<androidVersionCode>\d+)".*>/,
    );

    const { androidVersionCode, version } = versionNumberMatches.groups;

    viteEnv.VITE_APP_VERSION = `${version}-${androidVersionCode}`;

    if (!version || !androidVersionCode) {
      console.error("Failed to extract version numbers from config.xml!");
      process.exit(1);
    }
  }

  // ----------------------------------------------------
  // --- Set some environment variables automatically ---
  // ----------------------------------------------------
  viteEnv.VITE_SENTRY_DSN = viteEnv.SENTRY_DSN;

  // ----------------------------
  // --- Validate import.meta.env ---
  // ----------------------------

  const env = cleanEnv(viteEnv, {
    BEEPASS_ANDROID_KEYALIAS: str({ default: "" }),
    BEEPASS_ANDROID_KEYPASS: str({ default: "" }),
    BEEPASS_ANDROID_STOREPASS: str({ default: "" }),
    SENTRY_DSN: protocolAndHost(),
    VITE_APP_VERSION: str(),
    VITE_BUILD_TYPE: buildType(),
    VITE_DEFAULT_ACCESS_KEY: str({ default: "" }),
    VITE_ENABLE_FEEDBACK_PAGE: booleanString({ default: "" }),
    VITE_ENABLE_STANDALONE_REACT_DEVTOOLS: booleanString({ default: "" }),
    VITE_LANDING_PAGE_ENDPOINT: protocolAndHost(),
    VITE_LANDING_PAGE_IP_HEADER_NAME: str(),
    VITE_LANDING_PAGE_TYPE_HEADER_NAME: str(),
    VITE_LANDING_PAGE_TYPE_HEADER_VALUE: str(),
    VITE_SENTRY_DSN: str(),
  });
  // ---------------------------------------------------------------------------
  // --- Ensure env conforms to NodeJS.ProcessEnv (declared in lsw-env.d.ts) ---
  // ---------------------------------------------------------------------------

  const typedEnv: typeof env = env;

  return typedEnv;
};

export type ValidEnv = ReturnType<typeof loadAndValidateEnvironmentVariables>;

export default loadAndValidateEnvironmentVariables;
