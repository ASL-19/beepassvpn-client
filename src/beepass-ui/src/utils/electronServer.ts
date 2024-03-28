import * as errors from "../../../www/model/errors";

import { electron } from "src/utils/electron";
import { setLocalStorageValue } from "src/utils/localStorage";
import { getServerConfig } from "src/utils/serverUtilsShared";

const electronIsServerReachable = async (hostname: string, port: number) => {
  return electron.methodChannel.invoke("is-server-reachable", {
    hostname,
    port,
  });
};

export const electronInstallOutlineServer = async () => {
  return electron.methodChannel.invoke("install-outline-services");
};

// Same logic as start method
// https://github.com/Jigsaw-Code/outline-client/blob/HEAD/src/www/app/electron_outline_tunnel.ts
export const electronConnectToServer = async (
  id: string,
  accessKey: string,
) => {
  try {
    const config = await getServerConfig(accessKey);
    setLocalStorageValue({ key: "serverConfig", value: config });

    const reachable = await electronIsServerReachable(config.host, config.port);

    if (reachable) {
      const error = await electron.methodChannel.invoke("start-proxying", {
        config,
        id,
      });

      if (error !== errors.ErrorCode.NO_ERROR) {
        throw error;
      }
    } else {
      throw errors.toErrorCode(new errors.ServerUnreachable());
    }
  } catch (error) {
    if (typeof error === "number") {
      throw error;
    } else {
      console.error("Unknown: ", error);
    }
  }
};

export const electronDisconnectFromServer = async () => {
  try {
    setLocalStorageValue({ key: "serverConfig", value: null });

    await electron.methodChannel.invoke("stop-proxying");
  } catch (error) {
    if (typeof error === "number") {
      throw error;
    } else {
      console.error("Unknown: ", error);
    }
  }
};
