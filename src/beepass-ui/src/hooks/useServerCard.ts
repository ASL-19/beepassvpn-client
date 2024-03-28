import { LottiePlayer } from "lottie-react";
import { useEffect, useRef } from "react";

import connectionAnimationData from "src/static/connectionAnimationData.json";
import {
  Server,
  useAppDispatch,
  useLocaleCode,
  useServers,
} from "src/stores/appStore";
import {
  cordovaIsServerReachable,
  cordovaIsServerRunning,
} from "src/utils/cordovaServer";
import { getLocalStorageValue } from "src/utils/localStorage";
import { getServerConfig } from "src/utils/serverUtilsShared";

const useServersCard = (server: Server, expanded: boolean) => {
  const servers = useServers();
  const { connectionState: serverConnectionState } = servers.find(
    (serversServer) => serversServer.id === server.id,
  );
  const localeCode = useLocaleCode();
  const animationContainerRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationItem = useRef<any>({});
  const appDispatch = useAppDispatch();
  const hasSyncedCordovaServerConnectivityState = useRef(false);

  // Set up animation
  useEffect(() => {
    // Conditional render need to re-recreate animation instance
    if (animationContainerRef.current && !animationItem.current.loadAnimation) {
      animationItem.current = LottiePlayer.loadAnimation({
        animationData: connectionAnimationData,
        autoplay: false,
        container: animationContainerRef.current,
        loop: false,
        renderer: "svg",
      });
      // Since re-create a new animation instance, need to sync animation with current server connection state
      if (animationItem.current && serverConnectionState === "connected") {
        animationItem.current.goToAndStop(49, true);
      }
    }
    return () => animationItem.current?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  // When user quit the app, and reopen. sync server connectivity state.
  // Transform www/app/app.ts syncServerConnectivityState function into "react"
  useEffect(() => {
    const syncCordovaServerConnectivityState = async (
      id: string,
      accessKey: string,
    ) => {
      try {
        // when we haven't get state back, pause the animation.
        appDispatch({
          serverWithNewConnectionState: {
            ...server,
            connectionState: null,
          },
          type: "change_serverStatus",
        });

        const isRunning = await cordovaIsServerRunning(id);

        if (!isRunning) {
          appDispatch({
            serverWithNewConnectionState: {
              ...server,
              connectionState: "disconnected",
            },
            type: "change_serverStatus",
          });
          animationItem.current?.goToAndStop(0, true);
          return;
        }

        const isReachable = await (async () => {
          const config =
            getLocalStorageValue({ key: "serverConfig" }) ??
            (await getServerConfig(accessKey));
          return cordovaIsServerReachable(config.host || "", config.port || 0);
        })();

        if (isReachable) {
          appDispatch({
            serverWithNewConnectionState: {
              ...server,
              connectionState: "connected",
            },
            type: "change_serverStatus",
          });
          animationItem.current?.goToAndStop(49, true);
        } else {
          appDispatch({
            serverWithNewConnectionState: {
              ...server,
              connectionState: "reconnecting",
            },
            type: "change_serverStatus",
          });
        }
      } catch (error) {
        appDispatch({
          serverWithNewConnectionState: {
            ...server,
            connectionState: "disconnected",
          },
          type: "change_serverStatus",
        });
        console.error(
          `Failed to sync server connectivity state for ${accessKey}`,
          error,
        );
      }
    };

    if (
      (import.meta.env.VITE_BUILD_TYPE === "cordova-native" ||
        import.meta.env.VITE_BUILD_TYPE === "cordova-mock") &&
      !hasSyncedCordovaServerConnectivityState.current
    ) {
      hasSyncedCordovaServerConnectivityState.current = true;
      syncCordovaServerConnectivityState(server.id, server.accessKey);
    }
  }, [appDispatch, server]);

  return {
    animationContainerRef,
    animationItem,
    localeCode,
    serverConnectionState,
  };
};

export default useServersCard;
