import { FC, memo, useCallback, useEffect, useRef, useState } from "react";

import DefaultServerPrivacyButtonGroup from "src/components/PermissionDialog/DeaultServerPrivacyButtonGroup";
import PermissionDialog, {
  PermissionDialogContentStrings,
} from "src/components/PermissionDialog/PermissionDialog";
import ServerCardUI from "src/components/serverCard/ServerCardUI";
import useConnectionDuration from "src/hooks/useConnectionDuration";
import useLocalStoragePersistedState from "src/hooks/useLocalStoragePersistedState";
import useServersCard from "src/hooks/useServerCard";
import { useServerConnectionFunctions } from "src/hooks/useServerConnectionFunction";
import {
  Server,
  useAppDispatch,
  useServers,
  useStrings,
} from "src/stores/appStore";
import announce from "src/utils/announce";
import { setLocalStorageValue } from "src/utils/localStorage";

export type ServerCardStrings = {
  bestForSocialMedia: string;
  connectButtonLabel: string;
  connectedServerState: string;
  connectingServerState: string;
  /**
   * Name of the default (unremovable) server.
   */
  defaultServerName: string;
  defaultServerPrivacyPermissionDialogContent: PermissionDialogContentStrings;
  disconnectButtonLabel: string;
  disconnectedServerState: string;
  disconnectingServerState: string;
  reconnectingServerState: string;
  /**
   * Default name of user-added server.
   */
  serverDefaultName: string;
  serverForget: string;
  serverForgetAlertConfirm: string;
  serverForgetAlertTitle: string;
  serverRename: string;
  unreachableServerState: string;
};

const ServeCard: FC<{
  openAutoConnectModalIfNeeded: () => void;
  server: Server;
}> = memo(({ openAutoConnectModalIfNeeded, server }) => {
  const servers = useServers();
  const strings = useStrings();

  const {
    animationContainerRef,
    animationItem,
    localeCode,
    serverConnectionState,
  } = useServersCard(server, servers.length === 1);

  const serverConnectionFunctions = useServerConnectionFunctions({
    server,
  });
  const [
    defaultServerPrivacyDialogIsOpen,
    setDefaultServerPrivacyDialogIsOpen,
  ] = useState(false);

  const appDispatch = useAppDispatch();

  const containerElementRef = useRef<HTMLLIElement>(null);

  const { connectionDuration } = useConnectionDuration({
    serverConnectionState,
  });

  // Open privacy issue dialog if user hasn't agreed on terms
  const [
    defaultServerPrivacyDialogIsDismissed,
    setDefaultServerPrivacyDialogIsDismissed,
  ] = useLocalStoragePersistedState({
    initialVal: false,
    localStorageKey: "defaultServerPrivacyDialogDismissed",
  });

  const handlePrivacyDialogOpenFromBestForSocialMediaInfoIcon =
    useCallback(() => {
      setDefaultServerPrivacyDialogIsOpen(true);
    }, []);

  useEffect(() => {
    if (serverConnectionState === "connected") {
      openAutoConnectModalIfNeeded();
    }
  }, [openAutoConnectModalIfNeeded, serverConnectionState]);

  const connectToServer = useCallback(async () => {
    // clean up timer cache
    setLocalStorageValue({ key: "serverStartTime", value: null });

    if (serverConnectionState === "disconnected") {
      appDispatch({
        serverWithNewConnectionState: {
          ...server,
          connectionState: "connecting",
        },
        type: "change_serverStatus",
      });

      announce({
        priority: "assertive",
        text: strings.ServerCard.connectingServerState,
      });

      await serverConnectionFunctions.connectToServer();
    } else {
      appDispatch({
        serverWithNewConnectionState: {
          ...server,
          connectionState: "disconnecting",
        },
        type: "change_serverStatus",
      });

      announce({
        priority: "assertive",
        text: strings.ServerCard.disconnectingServerState,
      });

      await serverConnectionFunctions.disconnectFromServer();
    }
  }, [
    appDispatch,
    server,
    strings,
    serverConnectionFunctions,
    serverConnectionState,
  ]);

  const closeDefaultServerPrivacyDialog = useCallback(
    () => setDefaultServerPrivacyDialogIsOpen(false),
    [],
  );

  const connectAndDismissDefaultServerPrivacyDialog = useCallback(() => {
    // Invoke connection function
    connectToServer();

    // Change localStorage
    setDefaultServerPrivacyDialogIsDismissed(true);

    // close modal
    closeDefaultServerPrivacyDialog();
  }, [
    closeDefaultServerPrivacyDialog,
    connectToServer,
    setDefaultServerPrivacyDialogIsDismissed,
  ]);

  const showDefaultServerPrivacyDialogOrConnectToServer =
    useCallback(async () => {
      if (
        !defaultServerPrivacyDialogIsDismissed &&
        !defaultServerPrivacyDialogIsOpen &&
        server.isDefaultServer
      ) {
        setDefaultServerPrivacyDialogIsOpen(true);
        return;
      }

      await connectToServer();
    }, [
      defaultServerPrivacyDialogIsDismissed,
      defaultServerPrivacyDialogIsOpen,
      server,
      connectToServer,
    ]);

  return (
    <>
      <ServerCardUI
        animationContainerRef={animationContainerRef}
        animationItem={animationItem}
        onConnectButtonClick={showDefaultServerPrivacyDialogOrConnectToServer}
        containerElementRef={containerElementRef}
        expanded={servers.length === 1}
        localeCode={localeCode}
        server={server}
        serverConnectionState={serverConnectionState}
        connectionDuration={connectionDuration}
        handlePrivacyDialogOpenFromBestForSocialMediaInfoIcon={
          handlePrivacyDialogOpenFromBestForSocialMediaInfoIcon
        }
      />

      {server.isDefaultServer && (
        <PermissionDialog
          close={closeDefaultServerPrivacyDialog}
          variant={
            defaultServerPrivacyDialogIsDismissed ? "info" : "confirmation"
          }
          isOpen={defaultServerPrivacyDialogIsOpen}
          onConfirmButtonClick={connectAndDismissDefaultServerPrivacyDialog}
          ButtonGroup={DefaultServerPrivacyButtonGroup}
          permissionDialogContentStrings={
            strings.ServerCard.defaultServerPrivacyPermissionDialogContent
          }
        />
      )}
    </>
  );
});

ServeCard.displayName = "ServeCard";

export default ServeCard;
