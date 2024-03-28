import {
  LocalStorageKey,
  LocalStorageValueType,
  localStorageValueTypeNames,
  setLocalStorageValue,
} from "src/utils/localStorage";

const polymerAndReactLocalStorageKeyPairs: {
  [key: string]: {
    reactKey: LocalStorageKey;
    type: (typeof localStorageValueTypeNames)[LocalStorageKey];
  };
} = {
  "auto-connect-dialog-dismissed": {
    reactKey: "autoConnectDialogDismissed",
    type: "boolean",
  },
  "onboarding-complete": {
    reactKey: "onboardingCompleted",
    type: "boolean",
  },
  overrideLanguage: {
    reactKey: "language",
    type: "string",
  },
};

export const migrationLocalStorageKey = () => {
  Object.keys(polymerAndReactLocalStorageKeyPairs).forEach((polymerKey) => {
    const previousCacheValue = window.localStorage.getItem(polymerKey);

    if (previousCacheValue) {
      const newReactKeyInfo = polymerAndReactLocalStorageKeyPairs[polymerKey];

      const newReactKeyValue: LocalStorageValueType[(typeof localStorageValueTypeNames)[LocalStorageKey]] =
        newReactKeyInfo.type !== "string"
          ? JSON.parse(previousCacheValue)
          : previousCacheValue;

      // Only setup new localStorage from previous cache value if it's an expected value
      if (typeof newReactKeyValue === newReactKeyInfo.type) {
        setLocalStorageValue({
          key: newReactKeyInfo.reactKey,
          value: newReactKeyValue,
        });
      }

      // Remove previous version localStorage key
      window.localStorage.removeItem(polymerKey);

      console.info(
        `Migrated Polymer localStorage ${polymerKey} value to ${newReactKeyInfo.reactKey}`,
      );
    }
  });
};

// Only for testing, setup old polymer cache
export const setUpPolymerLocalStorage = ({
  autoConnectDialogDismissed,
  onboardingComplete,
  overrideLanguage,
}: {
  autoConnectDialogDismissed: boolean;
  onboardingComplete: boolean;
  overrideLanguage: string;
}) => {
  window.localStorage.setItem("overrideLanguage", overrideLanguage);
  window.localStorage.setItem(
    "onboarding-complete",
    JSON.stringify(onboardingComplete),
  );
  window.localStorage.setItem(
    "auto-connect-dialog-dismissed",
    JSON.stringify(autoConnectDialogDismissed),
  );
};
