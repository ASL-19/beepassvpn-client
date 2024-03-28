import { SHADOWSOCKS_URI } from "ShadowsocksConfig";

import { accessKeyToShadowsocksConfig } from "../../../www/app/outline_server_repository";
import { fetchShadowsocksSessionConfig } from "../../../www/app/outline_server_repository/access_key_serialization";
import { OutlineServer } from "../../../www/app/outline_server_repository/server";
import * as errors from "../../../www/model/errors";

export const isDynamicAccessKey = (accessKey: string) =>
  accessKey.startsWith("ssconf://") || accessKey.startsWith("https://");

const validateStaticKey = (staticKey: string) => {
  // const alreadyAddedServer = this.serverFromAccessKey(staticKey);
  // if (alreadyAddedServer) {
  //   throw new errors.ServerAlreadyAdded(alreadyAddedServer);
  // }
  let config = null;
  try {
    config = SHADOWSOCKS_URI.parse(staticKey);
  } catch (error) {
    throw new errors.ServerUrlInvalid(
      error.message || "failed to parse access key",
    );
  }
  if (config.host.isIPv6) {
    throw new errors.ServerIncompatible("unsupported IPv6 host address");
  }
  if (!OutlineServer.isServerCipherSupported(config.method.data)) {
    throw new errors.ShadowsocksUnsupportedCipher(
      config.method.data || "unknown",
    );
  }
};

export const validateAccessKey = (accessKey: string) => {
  if (!isDynamicAccessKey(accessKey)) {
    return validateStaticKey(accessKey);
  }

  try {
    // URL does not parse the hostname if the protocol is non-standard (e.g. non-http)
    // eslint-disable-next-line no-new
    new URL(accessKey.replace(/^ssconf:\/\//, "https://"));
  } catch (error) {
    throw new errors.ServerUrlInvalid(error.message);
  }
};

export const getServerConfig = async (accesskey: string) => {
  const config = isDynamicAccessKey(accesskey)
    ? await fetchShadowsocksSessionConfig(
        new URL(accesskey.replace("ssconf://", "https://")),
      )
    : accessKeyToShadowsocksConfig(accesskey);

  return config;
};
