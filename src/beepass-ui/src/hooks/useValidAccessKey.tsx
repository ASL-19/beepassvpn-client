import { useMemo } from "react";

import { useServers } from "../stores/appStore";

import { validateAccessKey } from "src/utils/serverUtilsShared";

export type AccessKeyValidity =
  | { isValid: true }
  | { isValid: false; reasonCode: "alreadyAdded" | "invalidFormat" };

export const useAccessKeyValidity = ({
  accessKey,
}: {
  accessKey: string;
}): AccessKeyValidity => {
  const servers = useServers();

  return useMemo(() => {
    if (accessKey.length === 0) {
      return { isValid: true };
    }

    if (servers.some((server) => server.accessKey === accessKey)) {
      return { isValid: false, reasonCode: "alreadyAdded" };
    }

    try {
      validateAccessKey(accessKey);
    } catch {
      return { isValid: false, reasonCode: "invalidFormat" };
    }

    return { isValid: true };
  }, [accessKey, servers]);
};
