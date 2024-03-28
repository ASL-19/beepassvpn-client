/* eslint-disable @typescript-eslint/no-explicit-any, no-console */

// Cordova functions for servers
//
// When import.meta.env.VITE_BUILD_TYPE === "cordova-mock" this file is mocked
// by src/utils/__mocks__/server.ts via a Webpack alias defined in
// craco.config.ts.

import * as errors from "../../../www/model/errors";

import { cordova, CordovaActionName } from "src/utils/cordova";
import { setLocalStorageValue } from "src/utils/localStorage";
import { openLandingPage } from "src/utils/openLandingPage";
import { getServerConfig } from "src/utils/serverUtilsShared";
import setServerStartTimeLocalStorageValueToNow from "src/utils/setServerStartTimeLocalStorageValueToNow";
import {
  platformConsistentlySendsConnectedEvent,
  platformSlug,
} from "src/values/platform";
import { OUTLINE_PLUGIN_NAME } from "src/values/serverValues";

// helper function to communicate with cordova
export const cordovaPluginExec = <T>(
  action: CordovaActionName,
  ...args: any
): Promise<T> => {
  return new Promise((resolve, reject) => {
    cordova.exec(resolve, reject, OUTLINE_PLUGIN_NAME, action, args);
  });
};

// helper function to communicate with cordova
const cordovaPluginExecWithErrorCode = async <T>(
  action: CordovaActionName,
  ...args: any
): Promise<T> => {
  return await cordovaPluginExec(action, ...args);
};

export const cordovaIsServerRunning = async (id: string) => {
  return cordovaPluginExecWithErrorCode<boolean>("isRunning", id);
};

export const cordovaIsServerReachable = async (host: string, port: number) => {
  return cordovaPluginExecWithErrorCode<boolean>(
    "isServerReachable",
    host,
    port,
  );
};

export const cordovaConnectToServer = async (
  id: string,
  accessKey: string,
  statusListener: () => void,
) => {
  console.info("Connecting to server:", accessKey);

  try {
    const config = await getServerConfig(accessKey);

    setLocalStorageValue({ key: "serverConfig", value: config });

    console.info("Resolved Shadowsocks config:", config);

    // check if server is available
    const reachable = await cordovaIsServerReachable(
      config.host || "",
      config.port || 0,
    );

    console.info("reachable: ", reachable);
    if (reachable) {
      // connect to server

      // TODO: Figure out why connectCode isn’t set in iOS or macOS
      //       From my understanding, Outline only return connectCode in Android.
      //       In osx or ios, we assume if pluginExecWithErrorCode doesn't throw up error,
      //       just set connection state to connected
      await cordovaPluginExecWithErrorCode<string>("start", id, config);

      // Cordova event listener has different behaviors on android, apple(macos, ios)

      // On Android Device: connected state changes happened in global event
      // listener, we make state changes | openLandingPage | set timer at global listener.

      // On Apple Device: connected state changes doesn't behavior consistently.
      // Therefore, make state changes | openLandingPage | set timer inline

      // Since ios and macos randomly skip connected event, therefore set timer
      // when user click on connect button
      if (!platformConsistentlySendsConnectedEvent) {
        await openLandingPage({ serverIp: config.host ?? "" });
        setServerStartTimeLocalStorageValueToNow();
        statusListener();
      }

      if (platformSlug === "browser") {
        statusListener();
      }
    } else {
      throw errors.toErrorCode(new errors.ServerUnreachable());
    }
  } catch (error) {
    if (typeof error === "number") {
      throw error;
    } else {
      console.error(error);
    }
  }
};

export const cordovaDisconnectFromServer = async (
  id: string,
  statusListener: () => void,
) => {
  try {
    setLocalStorageValue({ key: "serverConfig", value: null });

    await cordovaPluginExecWithErrorCode<string>("stop", id);

    // Cordova event listener doesn't dispatch disconnected event, therefore change status inline
    statusListener();
  } catch (error) {
    if (typeof error === "number") {
      throw error;
    } else {
      console.error(error);
    }
  }
};
