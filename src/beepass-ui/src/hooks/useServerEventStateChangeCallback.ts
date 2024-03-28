import { useCallback } from "react";

import { Server, useAppDispatch, useStrings } from "src/stores/appStore";
export const useServerEventStateChangeCallback = () => {
  const appDispatch = useAppDispatch();
  const { ServerCard: strings } = useStrings();

  const connectedEventStateChangeCallback = useCallback(
    (server: Server) => {
      appDispatch({
        messageInfo: {
          messageKey: "shared.serverConnected",
          messageParams: {
            serverName: server.name || strings.serverDefaultName,
          },
        },
        type: "add_message",
      });
      appDispatch({
        serverWithNewConnectionState: {
          ...server,
          connectionState: "connected",
        },
        type: "change_serverStatus",
      });
    },
    [appDispatch, strings.serverDefaultName],
  );

  const disconnectEventStateChangeCallback = useCallback(
    (server: Server) => {
      appDispatch({
        messageInfo: {
          messageKey: "shared.serverDisconnected",
          messageParams: {
            serverName: server.name || strings.serverDefaultName,
          },
        },
        type: "add_message",
      });
      appDispatch({
        serverWithNewConnectionState: {
          ...server,
          connectionState: "disconnected",
        },
        type: "change_serverStatus",
      });
    },
    [appDispatch, strings.serverDefaultName],
  );

  const reconnectingEventStateChangeCallback = useCallback(
    (server: Server) => {
      appDispatch({
        serverWithNewConnectionState: {
          ...server,
          connectionState: "reconnecting",
        },
        type: "change_serverStatus",
      });
    },
    [appDispatch],
  );

  return {
    connectedEventStateChangeCallback,
    disconnectEventStateChangeCallback,
    reconnectingEventStateChangeCallback,
  };
};
