import { useCallback, useEffect } from "react";
import { match } from "ts-pattern";

import { TunnelStatus } from "../../../www/app/tunnel";

import { useServerEventStateChangeCallback } from "src/hooks/useServerEventStateChangeCallback";
import { Server, useServers } from "src/stores/appStore";
import { cordova } from "src/utils/cordova";
import { electron } from "src/utils/electron";
import { getLocalStorageValue } from "src/utils/localStorage";
import matchConst from "src/utils/matchConst";
import { openLandingPage } from "src/utils/openLandingPage";
import { getServerConfig } from "src/utils/serverUtilsShared";
import setServerStartTimeLocalStorageValueToNow from "src/utils/setServerStartTimeLocalStorageValueToNow";
import { platformConsistentlySendsConnectedEvent } from "src/values/platform";
import { OUTLINE_PLUGIN_NAME } from "src/values/serverValues";

export const useGlobalListener = () => {
  const servers = useServers();
  const {
    connectedEventStateChangeCallback,
    disconnectEventStateChangeCallback,
    reconnectingEventStateChangeCallback,
  } = useServerEventStateChangeCallback();

  const setStartTimeAndChangeConnectedState = useCallback(
    (server: Server) => {
      setServerStartTimeLocalStorageValueToNow();
      connectedEventStateChangeCallback(server);
    },
    [connectedEventStateChangeCallback],
  );

  const connectedEventCallback = useCallback(
    async (server: Server) => {
      if (platformConsistentlySendsConnectedEvent) {
        try {
          const config =
            getLocalStorageValue({ key: "serverConfig" }) ??
            (await getServerConfig(server.accessKey));
          await openLandingPage({
            serverIp: config.host ?? "",
          });
        } catch (error) {
          console.error(error);
        }
        setStartTimeAndChangeConnectedState(server);
      }
    },
    [setStartTimeAndChangeConnectedState],
  );

  const electronEventListener = useCallback(() => {
    for (const server of servers) {
      electron.methodChannel.on(`proxy-connected-${server.id}`, async () => {
        console.info("useEffect received status:" + TunnelStatus.CONNECTED);
        await connectedEventCallback(server);
      });
      electron.methodChannel.on(`proxy-disconnected-${server.id}`, () => {
        console.info("useEffect received status:" + TunnelStatus.DISCONNECTED);
        disconnectEventStateChangeCallback(server);
      });
      electron.methodChannel.on(`proxy-reconnecting-${server.id}`, () => {
        console.info("useEffect received status:" + TunnelStatus.RECONNECTING);
        reconnectingEventStateChangeCallback(server);
      });
    }
  }, [
    connectedEventCallback,
    disconnectEventStateChangeCallback,
    reconnectingEventStateChangeCallback,
    servers,
  ]);

  const removeAllElectronEventListeners = useCallback(() => {
    servers.forEach((server) => {
      electron.methodChannel.removeAllListener(`proxy-connected-${server.id}`);
      electron.methodChannel.removeAllListener(
        `proxy-reconnecting-${server.id}`,
      );
      electron.methodChannel.removeAllListener(
        `proxy-disconnected-${server.id}`,
      );
    });
  }, [servers]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCordovaError = (err: any) => {
    console.warn("failed to execute status change listener", err);
  };

  const cordovaEventListener = useCallback(() => {
    for (const server of servers) {
      cordova.exec(
        (status: TunnelStatus) =>
          match(status)
            .with(TunnelStatus.CONNECTED, async () => {
              console.info(`connected with server ${server.id}`);
              await connectedEventCallback(server);
            })
            .with(TunnelStatus.DISCONNECTED, () => {
              console.info(`disconnected with server ${server.id}`);
              disconnectEventStateChangeCallback(server);
            })
            .with(TunnelStatus.RECONNECTING, () => {
              console.info(`reconnecting with server ${server.id}`);
              reconnectingEventStateChangeCallback(server);
            })
            .otherwise(() => {
              console.warn(`Received unknown tunnel status ${status}`);
            }),
        onCordovaError,
        OUTLINE_PLUGIN_NAME,
        "onStatusChange",
        [server.id],
      );
    }
  }, [
    connectedEventCallback,
    disconnectEventStateChangeCallback,
    reconnectingEventStateChangeCallback,
    servers,
  ]);

  useEffect(() => {
    matchConst(import.meta.env.VITE_BUILD_TYPE)
      .with("electron-mock", "electron-native", () => {
        electronEventListener();
      })
      .with("cordova-native", () => {
        cordovaEventListener();
      })
      .otherwise(() => {});

    return () => {
      matchConst(import.meta.env.VITE_BUILD_TYPE)
        .with("electron-mock", "electron-native", () => {
          removeAllElectronEventListeners();
        })
        .otherwise(() => {});
    };
  }, [
    cordovaEventListener,
    electronEventListener,
    removeAllElectronEventListeners,
  ]);
};
