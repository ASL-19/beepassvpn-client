import { css } from "@emotion/react";
import Button from "@mui/material/Button";
import { FC, memo, MouseEventHandler } from "react";

import { ServerConnectionState } from "src/stores/appStore";
import { useStrings } from "src/stores/appStore";
import colors from "src/style/colors";

namespace styles {
  export const connectButton = (
    serverState: ServerConnectionState,
    expanded: boolean,
  ) => css`
    min-width: ${expanded ? "100%" : "108px"};
    height: ${expanded ? "69px" : "28px"};
    padding: 0 8px;

    background-color: ${serverState === "disconnected"
      ? `${colors.yellow} !important`
      : `${colors.lightYellow} !important`};
    border-radius: ${expanded ? "0 0 10px 10px" : "3px"};

    color: ${colors.blackText};
    font-weight: 700;
    font-size: 14px;
  `;
}

const ServerConnectButton: FC<{
  className?: string;
  disabled: boolean;
  expanded: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  serverConnectionState: ServerConnectionState;
}> = memo(
  ({ className, disabled, expanded, onClick, serverConnectionState }) => {
    const { ServerCard: serverCardStrings } = useStrings();

    const connectAndDisconnectButtonLabel =
      serverConnectionState === "disconnected"
        ? serverCardStrings.connectButtonLabel
        : serverCardStrings.disconnectButtonLabel;

    return (
      <Button
        className={`${className}${disabled ? " Mui-disabled" : ""}`}
        css={styles.connectButton(serverConnectionState, expanded)}
        aria-disabled={disabled}
        onClick={disabled ? undefined : onClick}
      >
        {connectAndDisconnectButtonLabel}
      </Button>
    );
  },
);

ServerConnectButton.displayName = "ServerConnectButton";

export default ServerConnectButton;
