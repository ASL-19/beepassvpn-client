import { css } from "@emotion/react";
import IconButton from "@mui/material/IconButton";
import { FC, memo, MouseEventHandler, useEffect, useId, useMemo } from "react";
import { match, P } from "ts-pattern";

import {
  Language,
  Server,
  ServerConnectionState,
  useServers,
  useStrings,
} from "../../stores/appStore";
import colors from "../../style/colors";
import MoreIconAndMenu from "./MoreIconAndMenu";
import ServerConnectButton from "./ServerConnectButton";
import ServerConnectionStatus from "./ServerConnectionStatus";

import InfoOutlinedSvg from "src/components/icons/InfoOutlinedSvg";
import getDisplayAccessKey from "src/utils/getDisplayAccessKey";

namespace styles {
  export const serverCardContainer = ({
    expanded,
    serverConnectionState,
  }: {
    expanded: boolean;
    serverConnectionState: ServerConnectionState;
  }) => {
    const serverConnectionStateIsResolved =
      typeof serverConnectionState === "string";

    return css`
      position: relative;

      display: flex;
      flex-direction: ${expanded ? "column" : "row"};
      gap: 0.625rem;
      align-items: ${expanded ? "normal" : "center"};
      width: calc(100% - 1rem);
      max-width: 34.375rem;
      padding: 1rem;

      background-color: ${match(serverConnectionState)
        .with(
          "connecting",
          "connected",
          "reconnecting",
          () => colors.lightYellow2,
        )
        .otherwise(() => colors.serverCardGray)};
      border-radius: 10px;
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.12), 0 2px 2px rgba(0, 0, 0, 0.24);

      /* Don’t show the server card until server connection state is resolved
      (this is requested asynchronously when ServerCard mounts).

      Rather than hiding the state-dependent components (animation,
      ServerConnectButton, and ServerConnectionStatus) and showing them once the state
      resolves, we hide the entire card and animate it in. This way it looks like an
      intentional UI flourish :) */
      transform: translateY(${serverConnectionStateIsResolved ? "0" : "2rem"});
      opacity: ${serverConnectionStateIsResolved ? "1" : "0"};

      transition-duration: 0.3s;
      transition-property: opacity, transform;
    `;
  };

  const lineHeight = 1.4;

  export const serverCardInfoContainer = ({
    expanded,
    localeCode,
  }: {
    expanded: boolean;
    localeCode: Language;
  }) => css`
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    gap: ${expanded ? "0rem" : "1.25rem"};
    gap: 1.25rem;
    justify-content: space-between;
    min-width: 0;

    line-height: ${lineHeight};
    text-align: ${expanded ? "center" : localeCode === "en" ? "left" : "right"};
  `;

  export const serverInfoSection = ({ expanded }: { expanded: boolean }) => css`
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    gap: 0.5rem;
    align-items: ${expanded ? "center" : "start"};
    justify-content: start;
    width: 100%;
    padding-inline-end: ${expanded ? "0rem" : "1rem"};
  `;

  export const serverNameTitle = ({ expanded }: { expanded: boolean }) => css`
    width: 100%;
    padding-inline-end: ${expanded ? "0" : "1.5rem"};

    font-weight: 400;
    font-size: 1.125rem;

    /* Add space between title and menu button */
    ${expanded
      ? css`
          padding: 0 1.5rem;
        `
      : css`
          padding-inline-end: 1.5rem;
        `}
  `;

  const serverBestForContainer = css`
    display: flex;
    overflow: hidden;
    gap: 0.5rem;
    align-items: center;
    max-width: 100%;
    margin: -0.25rem;
    padding: 0.25rem;

    color: ${colors.blueNeon};
    font-size: 0.75rem;
    line-height: 0.875rem;
  `;

  export const serverBestForContainerCompact = css`
    ${serverBestForContainer};

    justify-content: start;
  `;

  export const serverBestForContainerExpanded = css`
    ${serverBestForContainer};

    justify-content: center;
  `;

  export const serverBestForIcon = css`
    flex: 0 0 auto;
  `;

  export const serverBestForText = css`
    overflow: hidden;
    flex: 1 1 auto;

    white-space: nowrap;
    text-overflow: ellipsis;
  `;

  export const expandedAnimationAndStatus = css`
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: center;
  `;

  export const serverSecondaryText = css`
    width: 100%;
    /* Make height fixed so that there’s no layout jump if
    ServerConnectionStatus returns an empty string  */
    height: calc(0.875rem * ${lineHeight});

    color: ${colors.lightGray};
    font-size: 0.875rem;
    text-overflow: ellipsis;
  `;

  export const serverConnectionStatus = css`
    width: 100%;

    color: ${colors.disableTextGray};
  `;

  export const serverConnectButton = ({ expanded }: { expanded: boolean }) =>
    css`
      ${expanded
        ? css`
            width: calc(100% + 2rem) !important;
            margin-bottom: -1rem;
            margin-inline-start: -1rem;
          `
        : css`
            align-self: flex-end;
          `};
    `;

  export const animationLink = ({ expanded }: { expanded: boolean }) => css`
    flex: 0 0 auto;
    padding: 0.125rem;

    line-height: 0;

    ${!expanded &&
    css`
      margin-inline-start: -0.75rem;
    `}
  `;

  export const animation = ({ expanded }: { expanded: boolean }) => css`
    width: ${expanded ? "12.5rem" : "6.25rem"};

    @media (max-height: 32rem) {
      width: ${expanded ? "8rem" : "6.25rem"};
    }

    @media (max-height: 28rem) {
      width: 6.25rem;
    }
  `;

  export const infoIconButton = css`
    padding: 0;

    color: ${colors.blueNeon};
  `;
}

const ServerCardUI: FC<{
  animationContainerRef: React.MutableRefObject<HTMLDivElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationItem: React.MutableRefObject<any>;
  connectionDuration: number | null;
  containerElementRef: React.MutableRefObject<HTMLLIElement>;
  expanded: boolean;
  handlePrivacyDialogOpenFromBestForSocialMediaInfoIcon: () => void;
  localeCode: Language;
  onConnectButtonClick: MouseEventHandler<HTMLButtonElement>;
  server: Server;
  serverConnectionState: ServerConnectionState;
}> = memo(
  ({
    animationContainerRef,
    animationItem,
    connectionDuration,
    containerElementRef,
    expanded,
    handlePrivacyDialogOpenFromBestForSocialMediaInfoIcon,
    localeCode,
    onConnectButtonClick,
    server,
    serverConnectionState,
  }) => {
    const servers = useServers();
    const { ServerCard: strings } = useStrings();
    const isOtherServerRunning = servers.some(
      (serversServer) =>
        serversServer.id !== server.id &&
        serversServer.connectionState !== "disconnected",
    );

    const connectButtonDisable =
      serverConnectionState === "connecting" ||
      serverConnectionState === "disconnecting" ||
      isOtherServerRunning;

    const displayAccessKey = useMemo(
      () => getDisplayAccessKey(server.accessKey),
      [server.accessKey],
    );

    const animationLinkElement = (
      <IconButton
        aria-hidden
        css={styles.animationLink({
          expanded,
        })}
        onClick={onConnectButtonClick}
        disabled={connectButtonDisable}
        tabIndex={-1}
      >
        <div
          aria-hidden
          css={styles.animation({ expanded })}
          ref={animationContainerRef}
        />
      </IconButton>
    );

    useEffect(() => {
      if (
        serverConnectionState === "connected" &&
        Object.keys(animationItem.current).length > 0
      ) {
        animationItem.current.setDirection(1);
        animationItem.current.play();
      }

      if (
        serverConnectionState === "disconnected" &&
        Object.keys(animationItem.current).length > 0
      ) {
        animationItem.current.setDirection(-1);
        animationItem.current.play();
      }
    }, [animationItem, serverConnectionState]);

    const serverName = useMemo(
      () =>
        match(server)
          .with({ isDefaultServer: true }, () => strings.defaultServerName)
          .with({ name: P.select(P.string) }, (name) => name)
          .otherwise(() => strings.serverDefaultName),
      [server, strings],
    );

    const id = useId();
    const serverNameHeadingId = `${id}-serverNameHeading`;
    const serverConnectionStateTextId = `${id}-serverConnectionStateText`;

    // console.log("Name", server.name);

    return (
      <>
        <li
          css={styles.serverCardContainer({ expanded, serverConnectionState })}
          ref={containerElementRef}
          aria-describedby={serverConnectionStateTextId}
          aria-labelledby={serverNameHeadingId}
        >
          {!expanded && animationLinkElement}

          <div
            css={styles.serverCardInfoContainer({
              expanded,
              localeCode,
            })}
          >
            <div css={styles.serverInfoSection({ expanded })}>
              <h3
                css={styles.serverNameTitle({ expanded })}
                id={serverNameHeadingId}
              >
                {serverName}
              </h3>

              {server.isDefaultServer && (
                <button
                  css={
                    expanded
                      ? styles.serverBestForContainerExpanded
                      : styles.serverBestForContainerCompact
                  }
                  onClick={
                    handlePrivacyDialogOpenFromBestForSocialMediaInfoIcon
                  }
                >
                  <InfoOutlinedSvg css={styles.serverBestForIcon} />
                  <p css={styles.serverBestForText}>
                    {strings.bestForSocialMedia}
                  </p>
                </button>
              )}

              <div css={styles.serverSecondaryText}>{displayAccessKey}</div>

              {!expanded && (
                <div css={styles.serverSecondaryText}>
                  <ServerConnectionStatus
                    connectionDuration={connectionDuration}
                    serverConnectionState={serverConnectionState}
                    serverConnectionStateTextId={serverConnectionStateTextId}
                  />
                </div>
              )}
            </div>

            {expanded && (
              <div css={styles.expandedAnimationAndStatus}>
                {animationLinkElement}

                <div css={styles.serverSecondaryText}>
                  <ServerConnectionStatus
                    connectionDuration={connectionDuration}
                    serverConnectionState={serverConnectionState}
                    serverConnectionStateTextId={serverConnectionStateTextId}
                  />
                </div>
              </div>
            )}

            {!server.isDefaultServer ? (
              <MoreIconAndMenu server={server} />
            ) : null}

            <ServerConnectButton
              css={styles.serverConnectButton({ expanded })}
              serverConnectionState={serverConnectionState}
              expanded={expanded}
              onClick={onConnectButtonClick}
              disabled={connectButtonDisable}
            />
          </div>
        </li>
      </>
    );
  },
);

ServerCardUI.displayName = "ServerCardUI";

export default ServerCardUI;
