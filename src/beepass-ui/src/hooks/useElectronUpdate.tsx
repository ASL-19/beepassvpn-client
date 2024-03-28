import { useEffect, useRef } from "react";

import { useAppDispatch } from "src/stores/appStore";
import { electron } from "src/utils/electron";

export const useElectronUpdate = () => {
  const appDispatch = useAppDispatch();
  const hasListenedUpdate = useRef(false);

  // Outline will check update every 6 hours.
  // Check electron/index.ts checkForUpdates function for more details
  useEffect(() => {
    if (import.meta.env.VITE_BUILD_TYPE !== "electron-native") {
      return;
    }

    if (hasListenedUpdate.current === false) {
      hasListenedUpdate.current = true;
      electron.methodChannel.on("update-download", () => {
        appDispatch({
          messageInfo: { messageKey: "shared.updateDownloaded" },
          type: "add_message",
        });
      });
    }
  }, [appDispatch]);
};
