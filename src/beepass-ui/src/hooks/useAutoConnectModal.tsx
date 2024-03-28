import { useCallback, useState } from "react";

import useLocalStoragePersistedState from "src/hooks/useLocalStoragePersistedState";

export const useAutoConnectModal = () => {
  // After users click on `Got it` button, autoConnect modal shouldn't show up again when user click on  `connect` button
  // Read it from cache
  const [autoConnectModalDismissed, setAutoConnectModalDismissed] =
    useLocalStoragePersistedState({
      initialVal: false,
      localStorageKey: "autoConnectDialogDismissed",
    });

  // Control autoConnect modal showup
  const [autoConnectModalOpen, setAutoConnectModalOpen] = useState(false);

  // The close modal function for `Got it` button, modal shouldn't be able to open again
  const closeAutoConnectModal = useCallback(() => {
    setAutoConnectModalOpen(false);
    setAutoConnectModalDismissed(true);
  }, [setAutoConnectModalDismissed]);

  // The open modal function when users click on connect button
  const openAutoConnectModalIfNeeded = useCallback(() => {
    if (!autoConnectModalDismissed) {
      setAutoConnectModalOpen(true);
    }
  }, [autoConnectModalDismissed]);

  return {
    autoConnectModalOpen,
    closeAutoConnectModal,
    openAutoConnectModalIfNeeded,
  };
};
