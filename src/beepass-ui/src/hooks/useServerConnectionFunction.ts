import { useCallback, useMemo } from "react";

import { useServerConnectionErrorHandling } from "src/hooks/useServerConnectionErrorHandling";
import { useServerEventStateChangeCallback } from "src/hooks/useServerEventStateChangeCallback";
import { Server, useAppDispatch, useServers } from "src/stores/appStore";
import {
  cordovaConnectToServer,
  cordovaDisconnectFromServer,
  cordovaIsServerRunning,
} from "src/utils/cordovaServer";
import {
  electron,
  MockElectronRendererMethodChannel,
} from "src/utils/electron";
import {
  electronConnectToServer,
  electronDisconnectFromServer,
} from "src/utils/electronServer";
import matchConst from "src/utils/matchConst";
import setServerStartTimeLocalStorageValueToNow from "src/utils/setServerStartTimeLocalStorageValueToNow";

export const useServerConnectionFunctions = ({
  server,
}: {
  server: Server;
}) => {
  const appDispatch = useAppDispatch();
  const { handleConnectionError } = useServerConnectionErrorHandling();
  const serversWithStates = useServers();
  const isElectronServerRunning = serversWithStates.some(
    (serverWithState) =>
      serverWithState.id === server.id &&
      (serverWithState.connectionState === "connected" ||
        serverWithState.connectionState === "connecting" ||
        serverWithState.connectionState == "reconnecting"),
  );

  const {
    connectedEventStateChangeCallback,
    disconnectEventStateChangeCallback,
  } = useServerEventStateChangeCallback();

  const electronConnectFunction = useCallback(async () => {
    if (electron.methodChannel instanceof MockElectronRendererMethodChannel) {
      electron.methodChannel.registerListener(() => {
        connectedEventStateChangeCallback(server);
        setServerStartTimeLocalStorageValueToNow();
      });
    }

    try {
      await electronConnectToServer(server.id, server.accessKey);
    } catch (error) {
      handleConnectionError(error, server);
    }
  }, [connectedEventStateChangeCallback, handleConnectionError, server]);

  const electronDisconnectFunction = useCallback(async () => {
    if (electron.methodChannel instanceof MockElectronRendererMethodChannel) {
      electron.methodChannel.registerListener(() => {
        disconnectEventStateChangeCallback(server);
      });
    }
    try {
      await electronDisconnectFromServer();
    } catch (error) {
      handleConnectionError(error, server);
    }
  }, [disconnectEventStateChangeCallback, handleConnectionError, server]);

  const electronForgetAndDisconnectFromServer = useCallback(async () => {
    if (isElectronServerRunning) {
      try {
        await electronDisconnectFromServer();
      } catch (error) {
        handleConnectionError(error, server);
      }
    }

    appDispatch({
      forgetServer: server,
      type: "forget_server",
    });
  }, [appDispatch, handleConnectionError, isElectronServerRunning, server]);

  const cordovaConnectFunction = useCallback(async () => {
    const connectionStateChange = () => {
      connectedEventStateChangeCallback(server);
    };

    try {
      const isRunning = await cordovaIsServerRunning(server.id);
      if (isRunning) {
        disconnectEventStateChangeCallback(server);
        return;
      }
      await cordovaConnectToServer(
        server.id,
        server.accessKey,
        connectionStateChange,
      );
    } catch (error) {
      handleConnectionError(error, server);
    }

    // TODO: Use returned config to replace ssconf host with resolved server
    // host (this will require some state change and maybe persistence since
    // the web process could be killed on mobile devices?)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  }, [
    connectedEventStateChangeCallback,
    disconnectEventStateChangeCallback,
    handleConnectionError,
    server,
  ]);

  const cordovaDisconnectFunction = useCallback(async () => {
    try {
      await cordovaDisconnectFromServer(server.id, () => {
        disconnectEventStateChangeCallback(server);
      });
    } catch (error) {
      handleConnectionError(error, server);
    }
  }, [disconnectEventStateChangeCallback, handleConnectionError, server]);

  const cordovaForgetAndDisconnectFromServer = useCallback(async () => {
    try {
      const isRunning = await cordovaIsServerRunning(server.id);
      if (isRunning) {
        await cordovaDisconnectFunction();
      }
    } catch (error) {
      handleConnectionError(error, server);
    }

    appDispatch({
      forgetServer: server,
      type: "forget_server",
    });
  }, [appDispatch, cordovaDisconnectFunction, handleConnectionError, server]);

  const connectToServer = useMemo(
    () =>
      matchConst(import.meta.env.VITE_BUILD_TYPE)
        .with("electron-mock", "electron-native", () => electronConnectFunction)
        .with("cordova-native", "cordova-mock", () => cordovaConnectFunction)
        .exhaustive(),
    [cordovaConnectFunction, electronConnectFunction],
  );

  const disconnectFromServer = useMemo(
    () =>
      matchConst(import.meta.env.VITE_BUILD_TYPE)
        .with(
          "electron-mock",
          "electron-native",
          () => electronDisconnectFunction,
        )
        .with("cordova-native", "cordova-mock", () => cordovaDisconnectFunction)
        .exhaustive(),
    [cordovaDisconnectFunction, electronDisconnectFunction],
  );

  /**
   * @returns Was the server disconnected and forgotten successfully?
   */
  const forgetAndDisconnectFromServer = useMemo(
    () =>
      matchConst(import.meta.env.VITE_BUILD_TYPE)
        .with(
          "electron-mock",
          "electron-native",
          () => electronForgetAndDisconnectFromServer,
        )
        .with(
          "cordova-mock",
          "cordova-native",
          () => cordovaForgetAndDisconnectFromServer,
        )
        .exhaustive(),
    [
      cordovaForgetAndDisconnectFromServer,
      electronForgetAndDisconnectFromServer,
    ],
  );

  return {
    connectToServer,
    disconnectFromServer,
    forgetAndDisconnectFromServer,
  };
};
