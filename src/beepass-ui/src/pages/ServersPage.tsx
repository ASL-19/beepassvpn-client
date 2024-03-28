import { css } from "@emotion/react";
import { FC, memo, useId } from "react";
import { lazy } from "react";

import AddServerModal from "src/components/AddServerModal";
import ScrollableContent from "src/components/ScrollableContent";
import ServersList from "src/components/ServersList";
import useAndroidExitAppOnBackButton from "src/hooks/useAndroidExitAppOnBackButton";
import { useAutoConnectModal } from "src/hooks/useAutoConnectModal";
import { useElectronUpdate } from "src/hooks/useElectronUpdate";
import { useOnboardingContext } from "src/hooks/useOnboardingContext";
import { useServers, useStrings } from "src/stores/appStore";
import { invisible } from "src/style/generalStyles";

// We lazy-load these components because they’re not part of the regular user
// flow (opening the app with onboarding complete and connecting/disconnecting).
// We don’t want the device to have to spend CPU time parsing and running the
// code for them when they won’t be rendered for most sessions.
//
// For components that are part of the regular user flow (e.g. ScrollableContent
// and ServersList) we avoid lazy loading since it will slow down the initial
// render.
//
// (Note that we import AddServerModal normally because it’s not rendered
// conditionally — even when it’s not open it’s still always rendered as part
// of the regular user flow.)
const AutoConnectModal = lazy(() => import("src/components/AutoConnectModal"));
const EmptyServer = lazy(() => import("src/components/EmptyServer"));
const OnboardingPage = lazy(() => import("src/pages/OnboardingPage"));

const autoConnectModal = css`
  flex: 0 0 auto;
  margin-bottom: 1.5rem;
`;

const ServersPage: FC = memo(() => {
  const servers = useServers();
  const strings = useStrings();

  const {
    autoConnectModalOpen,
    closeAutoConnectModal,
    openAutoConnectModalIfNeeded,
  } = useAutoConnectModal();

  const { onboardingCompleted } = useOnboardingContext();

  useAndroidExitAppOnBackButton();
  useElectronUpdate();

  const serversListHeadingId = useId();

  return (
    <>
      {!onboardingCompleted ? (
        <OnboardingPage />
      ) : (
        <ScrollableContent>
          {autoConnectModalOpen && (
            <AutoConnectModal
              css={autoConnectModal}
              onClose={closeAutoConnectModal}
            />
          )}
          {servers.length > 0 ? (
            <>
              <h2 css={invisible} id={serversListHeadingId}>
                {strings.ServersPage.serversMenuItem}
              </h2>

              <ServersList
                aria-labelledby={serversListHeadingId}
                openAutoConnectModalIfNeeded={openAutoConnectModalIfNeeded}
                servers={servers}
              />
            </>
          ) : (
            <EmptyServer />
          )}
          <AddServerModal />
        </ScrollableContent>
      )}
    </>
  );
});

ServersPage.displayName = "ServersPage";

export default ServersPage;
