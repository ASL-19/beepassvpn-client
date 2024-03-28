import { css } from "@emotion/react";
import { Drawer, IconButton } from "@mui/material";
import { Fragment, memo, useCallback } from "react";

import AddSvg from "src/components/icons/AddSvg";
import BeePassPoweredByOutlineLogoSvg from "src/components/icons/BeePassPoweredByOutlineLogoSvg";
import HamburgerSvg from "src/components/icons/HamburgerSvg";
import HeaderNavMenu from "src/components/navigator/HeaderNavMenu";
import { useAddServerModalContext } from "src/hooks/useAddServerModalContext";
import { useLocaleCode, useStrings } from "src/stores/appStore";
import {
  navLogoContainer,
  navSideIconContainer,
  navSvgIcon,
} from "src/style/navStyles";

export type HeaderMainPageContentStrings = {
  /**
   * A11y label for the hexagonal “Add servers” button.
   */
  addServersButtonA11yLabel: string;

  /**
   * A11y label for the hamburger menu button.
   */
  menuButtonAllyLabel: string;
};

const addSvg = css`
  width: 35px;
  height: 35px;
`;

/* stylelint-disable */
const HeaderMainPageContent = memo(
  ({
    openNav,
    setOpenNav,
  }: {
    openNav: boolean;
    setOpenNav: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const localeCode = useLocaleCode();
    const { handleAddServerModalOpen } = useAddServerModalContext();
    const handleMenuToggle = useCallback(() => {
      setOpenNav(!openNav);
    }, [openNav, setOpenNav]);
    const strings = useStrings();

    return (
      <Fragment>
        <div css={navSideIconContainer}>
          <IconButton
            onClick={handleMenuToggle}
            aria-expanded={!openNav}
            aria-label={strings.HeaderMainPageContent.menuButtonAllyLabel}
          >
            <HamburgerSvg css={navSvgIcon({ localeCode })} />
          </IconButton>
        </div>
        <div css={navLogoContainer} aria-label={strings.shared.appTitle}>
          <BeePassPoweredByOutlineLogoSvg />
        </div>
        <div css={navSideIconContainer}>
          <IconButton
            aria-label={strings.HeaderMainPageContent.addServersButtonA11yLabel}
            onClick={handleAddServerModalOpen}
          >
            <AddSvg css={addSvg} />
          </IconButton>
        </div>
        <Drawer
          anchor={localeCode === "en" ? "left" : "right"}
          open={openNav}
          onClose={handleMenuToggle}
          disableScrollLock={true}
        >
          <HeaderNavMenu handleMenuToggle={handleMenuToggle} />
        </Drawer>
      </Fragment>
    );
  },
);

HeaderMainPageContent.displayName = "HeaderMainPageContent";

export default HeaderMainPageContent;
