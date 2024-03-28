import constate from "constate";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useReducer } from "react";
import { match } from "ts-pattern";

import * as errors from "../../../www/model/errors";

import enStrings from "src/strings/enStrings";
import faStrings from "src/strings/faStrings";
import {
  DotSeparatedStringKey,
  StringKey,
  Strings,
} from "src/strings/stringTypes";
import { mapErrorMessageKey } from "src/utils/errors";
import { setLocalStorageValue } from "src/utils/localStorage";
import reducerLog from "src/utils/store/reducerLog";
import updateDocumentAttributes from "src/utils/updateDocumentAttributes";
import { SERVERS_LOCAL_STORAGE_KEY } from "src/values/serverValues";

export type ServerConnectionState =
  | "connected"
  | "connecting"
  | "disconnected"
  | "disconnecting"
  | "reconnecting"
  | null;

export type PersistedServer = {
  accessKey: string;
  id: string;
  isDefaultServer: boolean;
  name?: string;
};

export type Server = PersistedServer & {
  connectionState: ServerConnectionState;
};

type MessageInfo = {
  messageKey: DotSeparatedStringKey;
  messageParams?: { [key: string]: StringKey };
};

export type Language = "en" | "fa";

type AppOverlayScrollbarsComponent = typeof OverlayScrollbarsComponent | null;

export type AppState = {
  OverlayScrollbarsComponent?: AppOverlayScrollbarsComponent;
  language: Language;
  messageInfos: Array<MessageInfo>;
  servers: Array<Server>;
  strings: Strings;
};

export type AppStoreAction =
  | {
      newServer: Server;
      type: "add_server";
    }
  | {
      id: string;
      newName: string;
      type: "rename_server";
    }
  | {
      forgetServer: Server;
      type: "forget_server";
    }
  | { type: "clean_message" }
  | {
      messageInfo: MessageInfo;
      type: "add_message";
    }
  | {
      error: Error | errors.NativeError;
      type: "add_error_message";
    }
  | {
      language: Language;
      type: "change_language";
    }
  | {
      serverWithNewConnectionState: Server;
      type: "change_serverStatus";
    }
  | {
      OverlayScrollbarsComponent: AppOverlayScrollbarsComponent;
      type: "overlayScrollbarsComponentUpdated";
    };

const persistServers = (servers: Array<Server>) => {
  const persistedServers: Array<PersistedServer> = servers.map(
    ({ accessKey, id, isDefaultServer, name }) => ({
      accessKey,
      id,
      isDefaultServer,
      name,
    }),
  );

  setLocalStorageValue({
    key: SERVERS_LOCAL_STORAGE_KEY,
    value: persistedServers,
  });
};

const appReducer = (state: AppState, action: AppStoreAction) => {
  const newState: AppState = match(action)
    .with({ type: "add_server" }, (action) => {
      const { newServer } = action;
      const { messageInfos, servers } = state;

      const newServers: Array<Server> = [...servers, newServer];

      persistServers(newServers);

      // display add server message
      const newMessageInfo: MessageInfo = {
        messageKey: "shared.serverAdded",
        messageParams: {
          serverName:
            newServer.name ?? state.strings.ServerCard.serverDefaultName,
        },
      };

      const newMessageInfos = [...messageInfos, newMessageInfo];

      return {
        ...state,
        messageInfos: newMessageInfos,
        servers: newServers,
      };
    })
    .with({ type: "rename_server" }, (action) => {
      const { id, newName } = action;
      const { messageInfos, servers } = state;

      const newServers = servers.map((server) => {
        if (server.id === id) {
          return {
            ...server,
            name: newName,
          };
        }
        return server;
      });

      persistServers(newServers);

      const newMessageInfo: MessageInfo = {
        messageKey: "shared.serverRenameComplete",
      };

      const newMessageInfos = [...messageInfos, newMessageInfo];

      return {
        ...state,
        messageInfos: newMessageInfos,
        servers: newServers,
      };
    })
    .with({ type: "forget_server" }, (action) => {
      const { forgetServer } = action;
      const { messageInfos, servers } = state;

      const newServers = servers.filter(
        (server) => server.id !== forgetServer.id,
      );

      persistServers(newServers);

      const newMessageInfo: MessageInfo = {
        messageKey: "shared.serverForgotten",
        messageParams: {
          serverName:
            forgetServer.name ?? state.strings.ServerCard.serverDefaultName,
        },
      };

      const newMessageInfos = [...messageInfos, newMessageInfo];

      return {
        ...state,
        messageInfos: newMessageInfos,
        servers: newServers,
      };
    })
    .with({ type: "clean_message" }, () => {
      const newMessageInfos = [...state.messageInfos].slice(1);
      return {
        ...state,
        messageInfos: newMessageInfos,
      };
    })
    .with({ type: "add_message" }, (action) => {
      const { messageInfo } = action;
      const newMessageInfos = [...state.messageInfos, messageInfo];
      return {
        ...state,
        messageInfos: newMessageInfos,
      };
    })
    .with({ type: "add_error_message" }, (action) => {
      const { error } = action;

      const newMessageInfos = [
        ...state.messageInfos,
        mapErrorMessageKey(error),
      ];

      return {
        ...state,
        messageInfos: newMessageInfos,
      };
    })
    .with({ type: "change_language" }, (action) => {
      // persist language setting
      setLocalStorageValue({
        key: "language",
        value: action.language,
      });

      updateDocumentAttributes(action.language);

      const newStrings = action.language === "en" ? enStrings : faStrings;

      return {
        ...state,
        language: action.language,
        strings: newStrings,
      };
    })
    .with({ type: "change_serverStatus" }, (action) => {
      const { serverWithNewConnectionState } = action;
      const { servers } = state;

      const newServers: Array<Server> = servers.map((server) =>
        server.id === serverWithNewConnectionState.id
          ? serverWithNewConnectionState
          : server,
      );

      return {
        ...state,
        servers: newServers,
      };
    })
    .with({ type: "overlayScrollbarsComponentUpdated" }, (action) => {
      const { OverlayScrollbarsComponent } = action;
      return {
        ...state,
        OverlayScrollbarsComponent,
      };
    })
    .exhaustive();

  reducerLog({
    action,
    newState,
    state,
    storeName: "servers",
  });

  return newState;
};

const useAppStore = ({ initialState }: { initialState: AppState }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return { dispatch, state };
};

export const [
  AppStoreProvider,
  useAppDispatch,
  useServers,
  useMessageInfos,
  useStrings,
  useLocaleCode,
  useAppOverlayScrollbarsComponent,
] = constate(
  useAppStore,
  (value) => value.dispatch,
  (value) => value.state.servers,
  (value) => value.state.messageInfos,
  (value) => value.state.strings,
  (value) => value.state.language,
  (value) => value.state.OverlayScrollbarsComponent,
);
