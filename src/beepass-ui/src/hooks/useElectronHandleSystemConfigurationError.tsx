import * as errors from "../../../www/model/errors";

import { useAppDispatch, useStrings } from "src/stores/appStore";
import { electronInstallOutlineServer } from "src/utils/electronServer";

export const useElectronHandleSystemConfigurationError = () => {
  const strings = useStrings();
  const appDispatch = useAppDispatch();

  // TODO: add persian strings
  const handleSystemConfigurationError = async () => {
    if (
      window.confirm(
        strings.beepassPluginStrings.beepassServicesInstallationConfirmation,
      )
    ) {
      // display message start installing server
      appDispatch({
        messageInfo: {
          messageKey: "beepassPluginStrings.beepassServicesInstalling",
        },
        type: "add_message",
      });
      try {
        await electronInstallOutlineServer();
        // display message server installed
        appDispatch({
          messageInfo: {
            messageKey: "beepassPluginStrings.beepassServicesInstalled",
          },
          type: "add_message",
        });
      } catch (e) {
        const error = e.errorCode ? errors.fromErrorCode(e.errorCode) : e;
        console.error("failed to set up Beepass VPN", error);
        if (error instanceof errors.UnexpectedPluginError) {
          // display error message install failed
          appDispatch({
            messageInfo: {
              messageKey:
                "beepassPluginStrings.beepassPluginErrorSystemConfiguration",
            },
            type: "add_message",
          });
        } else {
          appDispatch({
            error,
            type: "add_error_message",
          });
        }
      }
    }
  };

  return handleSystemConfigurationError;
};
