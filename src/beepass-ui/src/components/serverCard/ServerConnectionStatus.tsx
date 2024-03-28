import { memo } from "react";
import { match } from "ts-pattern";

import ServerConnectionDuration from "src/components/serverCard/ServerConnectionDuration";
import { ServerConnectionState } from "src/stores/appStore";
import { useStrings } from "src/stores/appStore";

const ServerConnectionStatus = memo(
  ({
    connectionDuration,
    serverConnectionState,
    serverConnectionStateTextId,
  }: {
    connectionDuration: number | null;
    serverConnectionState: ServerConnectionState;
    serverConnectionStateTextId: string;
  }) => {
    const { ServerCard: serverCardStrings } = useStrings();

    const serverConnectionStateText = match(serverConnectionState)
      .with("connected", () => serverCardStrings.connectedServerState)
      .with("connecting", () => serverCardStrings.connectingServerState)
      .with("disconnected", () => serverCardStrings.disconnectedServerState)
      .with("disconnecting", () => serverCardStrings.disconnectingServerState)
      .with("reconnecting", () => serverCardStrings.reconnectingServerState)
      // serverConnectionState can be null (at least in tests?)
      .otherwise(() => "");

    return (
      <p>
        <span id={serverConnectionStateTextId}>
          {serverConnectionStateText}
        </span>{" "}
        {serverConnectionState === "connected" &&
          typeof connectionDuration === "number" && (
            <span>
              {"("}
              <ServerConnectionDuration
                connectionDuration={connectionDuration}
              />
              {")"}
            </span>
          )}
      </p>
    );
  },
);

ServerConnectionStatus.displayName = "ServerConnectionStatus";

export default ServerConnectionStatus;
