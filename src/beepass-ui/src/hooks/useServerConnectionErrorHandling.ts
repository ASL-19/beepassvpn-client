import { useCallback } from "react";

import * as errors from "../../../www/model/errors";

import { useElectronHandleSystemConfigurationError } from "src/hooks/useElectronHandleSystemConfigurationError";
import { Server, useAppDispatch } from "src/stores/appStore";

export const useServerConnectionErrorHandling = () => {
  const appDispatch = useAppDispatch();

  const handleSystemConfigurationError =
    useElectronHandleSystemConfigurationError();

  const handleConnectionError = useCallback(
    async (error: errors.ErrorCode, server: Server) => {
      console.error("Error while connecting/disconnecting:", { error, server });

      const errorType = errors.fromErrorCode(error);

      appDispatch({
        serverWithNewConnectionState: {
          ...server,
          connectionState: "disconnected",
        },
        type: "change_serverStatus",
      });

      // This will help to handle electron case: when user connected to server,
      // then trying to connect with another one
      if (
        import.meta.env.VITE_BUILD_TYPE === "electron-native" &&
        errorType instanceof errors.SystemConfigurationException
      ) {
        await handleSystemConfigurationError();
        return;
      }

      appDispatch({
        error: errorType,
        type: "add_error_message",
      });
    },
    [appDispatch, handleSystemConfigurationError],
  );

  return {
    handleConnectionError,
  };
};
