import { asType } from "@asl-19/js-utils";
import { P } from "ts-pattern";
import uuidv4 from "uuidv4";

import { PersistedServer } from "src/stores/appStore";
import serverTestDataById from "src/testData/serverTestDataById";
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "src/utils/localStorage";
import matchConst from "src/utils/matchConst";
import { SERVERS_LOCAL_STORAGE_KEY } from "src/values/serverValues";

const updateCachedServerWithDefaultServer = (
  persistedServers: Array<PersistedServer>,
  defaultServer: PersistedServer,
) => {
  if (!persistedServers) {
    console.info(
      "[updateCachedServerWithDefaultServer] Returning initial servers",
    );

    const initialServers = matchConst({
      buildType: import.meta.env.VITE_BUILD_TYPE,
      defaultAccessKey: import.meta.env.VITE_DEFAULT_ACCESS_KEY,
    })
      .with({ buildType: P.union("cordova-mock", "electron-mock") }, () => [
        defaultServer,
        ...Object.values(serverTestDataById).map((server) =>
          asType<PersistedServer>({
            accessKey: server.accessKey,
            id: server.id,
            isDefaultServer: server.isDefaultServer,
            name: server.name,
          }),
        ),
      ])
      .with({ defaultAccessKey: P.union("", P.nullish) }, () => [])
      .with({ defaultAccessKey: P.string }, () => [defaultServer])
      .exhaustive();

    return initialServers;
  }

  const serversWithDefaultServerAttribute = persistedServers.map((server) => ({
    ...server,
    isDefaultServer: server.isDefaultServer ?? false,
  }));

  if (
    import.meta.env.VITE_DEFAULT_ACCESS_KEY &&
    !serversWithDefaultServerAttribute[0]?.isDefaultServer
  ) {
    console.info("[updateCachedServerWithDefaultServer] Adding default server");

    return [defaultServer, ...serversWithDefaultServerAttribute];
  }

  if (
    serversWithDefaultServerAttribute[0].isDefaultServer &&
    !import.meta.env.VITE_DEFAULT_ACCESS_KEY
  ) {
    console.info(
      "[updateCachedServerWithDefaultServer] Removing default server",
    );

    return serversWithDefaultServerAttribute.filter(
      (server) => !server.isDefaultServer,
    );
  }

  if (
    serversWithDefaultServerAttribute[0].isDefaultServer &&
    import.meta.env.VITE_DEFAULT_ACCESS_KEY &&
    serversWithDefaultServerAttribute[0].accessKey !==
      import.meta.env.VITE_DEFAULT_ACCESS_KEY
  ) {
    console.info(
      "[updateCachedServerWithDefaultServer] Updating default server",
    );

    const serversWithUpdatedDefaultServer = persistedServers.map(
      (server, index) => (index === 0 ? defaultServer : server),
    );

    return serversWithUpdatedDefaultServer;
  }

  console.info("[updateCachedServerWithDefaultServer] No update necessary");

  return persistedServers;
};

const getPersistedServers = () => {
  // getLocalStorageValue could trigger an exception if the value was malformed
  // (shouldn’t ever happen but if it did it would be catastrophic!)
  const serversV1JSON = (() => {
    try {
      return getLocalStorageValue({
        key: SERVERS_LOCAL_STORAGE_KEY,
      });
    } catch {
      return null;
    }
  })();

  const defaultServer: PersistedServer = {
    accessKey: import.meta.env.VITE_DEFAULT_ACCESS_KEY,
    id: uuidv4(),
    isDefaultServer: true,
  };

  const persistedServers = updateCachedServerWithDefaultServer(
    serversV1JSON,
    defaultServer,
  );

  setLocalStorageValue({
    key: "servers_v1",
    value: persistedServers,
  });

  return persistedServers;
};

export default getPersistedServers;
