import { css } from "@emotion/react";
import { FC, memo, useState } from "react";
import { useLocation } from "react-router-dom";

import HeaderChildPageContent from "./HeaderChildPageContent";
import HeaderMainPageContent from "./HeaderMainPageContent";

import { useOnboardingContext } from "src/hooks/useOnboardingContext";
import colors from "src/style/colors";
import { headerHeight, pageMinWidth } from "src/values/layoutValues";

namespace styles {
  export const nav = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    min-width: ${pageMinWidth};
    height: ${headerHeight};
    padding: 0 10px;

    background-color: ${colors.white};
  `;
}

const Header: FC<{ className?: string }> = memo(({ className }) => {
  const [openNav, setOpenNav] = useState(false);
  const location = useLocation();
  const { onboardingCompleted } = useOnboardingContext();

  return (
    <header
      className={className}
      css={styles.nav}
      role="navigation"
      aria-hidden={!onboardingCompleted}
    >
      {location.pathname === "/servers" ? (
        <HeaderMainPageContent openNav={openNav} setOpenNav={setOpenNav} />
      ) : (
        <HeaderChildPageContent />
      )}
    </header>
  );
});

Header.displayName = "Header";

export default Header;
