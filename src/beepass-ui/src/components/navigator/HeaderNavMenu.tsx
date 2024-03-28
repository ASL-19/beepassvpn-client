import { css } from "@emotion/react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { memo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import colors from "../../style/colors";
import FeedbackSvg from "../icons/FeedbackSvg";
import HelpSvg from "../icons/HelpSvg";
import InfoFilledSvg from "../icons/InfoFilledSvg";
import ServersSvg from "../icons/ServersSvg";

import BeepassPoweredByOutlineLogoSvg from "src/components/icons/BeePassPoweredByOutlineLogoSvg";
import LanguageSvg from "src/components/icons/LanguageSvg";
import QuitSvg from "src/components/icons/QuitSvg";
import {
  Language,
  useAppDispatch,
  useLocaleCode,
  useStrings,
} from "src/stores/appStore";
import { cordova } from "src/utils/cordova";
import { electron } from "src/utils/electron";
import matchConst from "src/utils/matchConst";
import { platformSlug } from "src/values/platform";
import { OUTLINE_PLUGIN_NAME } from "src/values/serverValues";

export type HeaderNavMenuStrings = {
  /**
   * A11y label for the external links list (Privacy Policy, Terms of Service,
   * Licenses).
   */
  externalLinksListA11yLabel: string;

  /**
   * A11y label for the screens list (Servers, About, Help, and Change
   * Language).
   */
  screensListA11yLabel: string;
};

namespace styles {
  export const navLogoContainer = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 11.25rem;
    padding: 0 1rem;

    background-color: ${colors.beige};

    svg {
      width: 100%;
    }

    @media (max-height: 600px) {
      height: 5.25rem;
    }
  `;

  export const navMenuContainer = css`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 17.5rem;

    @media (max-height: 480px) {
      width: 15.625rem;
    }
  `;

  export const navMenuItem = ({ isActive }: { isActive: boolean }) => css`
    width: 100%;
    min-height: 3rem;

    cursor: pointer;

    color: ${isActive ? `${colors.blueNeon}` : `${colors.blackText}`};
    font-size: 1rem;

    @media (max-height: 480px) {
      min-height: 2.625rem;
    }
  `;

  const listItemIcon = css`
    width: 1.5rem;
    height: 1.5rem;
    margin-inline-end: 1.875rem;
  `;

  export const listItemIconInactive = css`
    ${listItemIcon}

    fill: ${colors.menuIconGray};
  `;

  export const listItemIconActive = css`
    ${listItemIcon}

    fill: ${colors.blueNeon};
  `;

  export const listItemTextStyle = ({ localeCode }: { localeCode: Language }) =>
    css`
      text-align: ${localeCode === "en" ? "left" : "right"};
    `;

  export const linkItem = css`
    min-height: 2rem;

    @media (min-height: 600px) {
      min-height: 3rem;
    }
  `;

  export const linkItemText = ({ localeCode }: { localeCode: Language }) => css`
    .MuiListItemText-primary {
      font-size: 1rem;
      text-align: ${localeCode === "en" ? "left" : "right"};
    }
  `;
}
// Only List and ListItemButton have default browser focus-behavior(use Tab key to focus) within Drawer
const HeaderNavMenu = memo(
  ({ handleMenuToggle }: { handleMenuToggle: () => void }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const localeCode = useLocaleCode();
    const appDispatch = useAppDispatch();
    const handleRouteRedirection = useCallback(
      (direction: string) => () => {
        handleMenuToggle();
        navigate(direction);
      },
      [handleMenuToggle, navigate],
    );
    const strings = useStrings();

    const showQuitButton = matchConst(platformSlug)
      .with("macos", "windows", () => true)
      .otherwise(() => false);

    const quitApplication = useCallback(() => {
      try {
        if (import.meta.env.VITE_BUILD_TYPE === "cordova-native") {
          cordova.exec(
            () => {},
            () => {},
            OUTLINE_PLUGIN_NAME,
            "quitApplication",
            [],
          );
        } else if (import.meta.env.VITE_BUILD_TYPE === "electron-native") {
          electron.methodChannel.send("quit-app");
        }
      } catch (error) {
        appDispatch({
          error,
          type: "add_error_message",
        });
      }
    }, [appDispatch]);

    return (
      <nav css={styles.navMenuContainer}>
        <div aria-hidden css={styles.navLogoContainer}>
          <BeepassPoweredByOutlineLogoSvg />
        </div>
        <Divider />
        <List
          aria-label={strings.HeaderNavMenu.screensListA11yLabel}
          aria-orientation="vertical"
        >
          <ListItem disablePadding>
            <ListItemButton
              css={styles.navMenuItem({
                isActive: location.pathname === "/servers",
              })}
              onClick={handleRouteRedirection("/servers")}
            >
              <ListItemIcon>
                <ServersSvg css={styles.listItemIconActive} />
              </ListItemIcon>
              <ListItemText
                primary={strings.ServersPage.serversMenuItem}
                css={styles.listItemTextStyle({ localeCode })}
              />
            </ListItemButton>
          </ListItem>

          {import.meta.env.VITE_ENABLE_FEEDBACK_PAGE && (
            <ListItem disablePadding>
              <ListItemButton
                css={styles.navMenuItem({
                  isActive: location.pathname === "/feedback",
                })}
                onClick={handleRouteRedirection("/feedback")}
              >
                <ListItemIcon>
                  <FeedbackSvg css={styles.listItemIconInactive} />
                </ListItemIcon>
                <ListItemText
                  primary={strings.FeedbackPage.feedbackPageTitle}
                  css={styles.listItemTextStyle({ localeCode })}
                />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding>
            <ListItemButton
              css={styles.navMenuItem({
                isActive: location.pathname === "/about",
              })}
              onClick={handleRouteRedirection("/about")}
            >
              <ListItemIcon>
                <InfoFilledSvg css={styles.listItemIconInactive} />
              </ListItemIcon>
              <ListItemText
                primary={strings.AboutPage.aboutPageTitle}
                css={styles.listItemTextStyle({ localeCode })}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              css={styles.navMenuItem({
                isActive: location.pathname === "/help",
              })}
              onClick={handleRouteRedirection("/help")}
            >
              <ListItemIcon>
                <HelpSvg css={styles.listItemIconInactive} />
              </ListItemIcon>
              <ListItemText
                primary={strings.HelpPage.helpPageTitle}
                css={styles.listItemTextStyle({ localeCode })}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              css={styles.navMenuItem({
                isActive: location.pathname === "/language",
              })}
              onClick={handleRouteRedirection("/language")}
            >
              <ListItemIcon>
                <LanguageSvg css={styles.listItemIconInactive} />
              </ListItemIcon>
              <ListItemText
                primary={strings.LanguagePage.languagePageTitle}
                css={styles.listItemTextStyle({ localeCode })}
              />
            </ListItemButton>
          </ListItem>
          {showQuitButton && (
            <ListItem disablePadding>
              <ListItemButton onClick={quitApplication}>
                <ListItemIcon>
                  <QuitSvg css={styles.listItemIconInactive} />
                </ListItemIcon>
                <ListItemText
                  primary={strings.shared.quit}
                  css={styles.listItemTextStyle({ localeCode })}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider />
        <List
          aria-label={strings.HeaderNavMenu.externalLinksListA11yLabel}
          aria-orientation="vertical"
        >
          <ListItem disablePadding>
            <ListItemButton
              css={styles.linkItem}
              href="https://beepassvpn.com/en/privacy-policy/"
            >
              <ListItemText
                css={styles.linkItemText({ localeCode })}
                primary={strings.PrivacyPage.privacy}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              css={styles.linkItem}
              href="https://beepassvpn.com/en/terms-of-service/"
            >
              <ListItemText
                css={styles.linkItemText({ localeCode })}
                primary={strings.TermsPage.termsPageTitle}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              css={styles.linkItem}
              onClick={handleRouteRedirection("/licenses")}
            >
              <ListItemText
                css={styles.linkItemText({ localeCode })}
                primary={strings.LicensesPage.licensesPageTitle}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    );
  },
);

HeaderNavMenu.displayName = "HeaderNavMenu";

export default HeaderNavMenu;
