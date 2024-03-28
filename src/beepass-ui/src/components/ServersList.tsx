import { StylableFC } from "@asl-19/react-dom-utils";
import { css } from "@emotion/react";
import { memo } from "react";

import ServeCard from "src/components/serverCard/ServeCard";
import { Server } from "src/stores/appStore";
import { notificationHeight } from "src/values/layoutValues";

const serversUl = css`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  width: 100%;
  /* space for bottom notification */
  padding-bottom: calc(${notificationHeight} + 1rem);
`;

const ServersList: StylableFC<{
  openAutoConnectModalIfNeeded: () => void;
  servers: Array<Server>;
}> = memo(({ openAutoConnectModalIfNeeded, servers, ...remainingProps }) => (
  <ul css={serversUl} {...remainingProps}>
    {servers.map((server) => (
      <ServeCard
        openAutoConnectModalIfNeeded={openAutoConnectModalIfNeeded}
        key={server.id}
        server={server}
      />
    ))}
  </ul>
));

ServersList.displayName = "ServersList";

export default ServersList;
