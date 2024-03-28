import { ShadowsocksConfig } from "../../../www/app/config";
import { ShadowsocksSessionConfig } from "../../../www/app/tunnel";

import { PersistedServer } from "src/stores/appStore";
import { SERVERS_LOCAL_STORAGE_KEY } from "src/values/serverValues";

export const localStorageValueTypeNames = {
  autoConnectDialogDismissed: "boolean",
  defaultServerPrivacyDialogDismissed: "boolean",
  language: "string",
  onboardingCompleted: "boolean",
  serverConfig: "ShadowsocksConfig | ShadowsocksSessionConfig",
  [SERVERS_LOCAL_STORAGE_KEY]: "Server[]",
  serverStartTime: "number",
} as const;

export type LocalStorageKey = keyof typeof localStorageValueTypeNames;

export type LocalStorageValueType = {
  Server:
    | PersistedServer
    // This means empty object ({} would match any object)
    | Record<string, never>;
  "Server[]": Array<PersistedServer>;
  "ShadowsocksConfig | ShadowsocksSessionConfig":
    | ShadowsocksConfig
    | ShadowsocksSessionConfig;
  boolean: boolean;
  number: number;
  string: string;
};

/**
 * Set a localStorage value.
 *
 * @remarks
 * - Key must be defined in `localStorageValueTypeNames`.
 * - Values associated with keys of type "boolean" are saved as string.
 */
export const setLocalStorageValue = <Key extends LocalStorageKey>({
  key,
  value,
}: {
  key: Key;
  value: LocalStorageValueType[(typeof localStorageValueTypeNames)[Key]];
}) => {
  window.localStorage.setItem(
    key,
    typeof value === "string" ? value : JSON.stringify(value),
  );
};

/**
 * Get a localStorage value.
 *
 * @remarks
 * - Key must be defined in `localStorageValueTypeNames`.
 * - Values returned as expected type
 */
export const getLocalStorageValue = <Key extends LocalStorageKey>({
  key,
}: {
  key: Key;
}) => {
  const stringValue = window.localStorage.getItem(key);

  const parsedValue =
    localStorageValueTypeNames[key] === "string"
      ? stringValue
      : JSON.parse(stringValue);

  return parsedValue as LocalStorageValueType[(typeof localStorageValueTypeNames)[Key]];
};
