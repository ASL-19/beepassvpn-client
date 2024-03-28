import { useCallback, useEffect, useMemo, useState } from "react";

import { ServerConnectionState } from "src/stores/appStore";
import { getLocalStorageValue } from "src/utils/localStorage";

const useConnectionDuration = ({
  serverConnectionState,
}: {
  serverConnectionState: ServerConnectionState;
}) => {
  const serverStartTime = useMemo(
    () => getLocalStorageValue({ key: "serverStartTime" }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [serverConnectionState],
  );

  /**
   * Get connection duration from serverStartTime.
   */
  const getConnectionDuration = useCallback(() => {
    const now = Math.floor(Date.now() / 1000);
    return serverStartTime ? now - serverStartTime : 0;
  }, [serverStartTime]);

  // Connection duration in seconds
  const [connectionDuration, setConnectionDuration] = useState(() =>
    getConnectionDuration(),
  );

  // Update duration on serverConnectionState change, manage update duration
  // interval
  useEffect(() => {
    let intervalId = null;

    if (serverConnectionState === "connected") {
      setConnectionDuration(getConnectionDuration());

      // update time every second
      intervalId = setInterval(
        () => setConnectionDuration(getConnectionDuration()),
        1000,
      );
    }

    if (serverConnectionState === "disconnected") {
      setConnectionDuration(null);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [getConnectionDuration, serverConnectionState]);

  return { connectionDuration };
};

export default useConnectionDuration;
