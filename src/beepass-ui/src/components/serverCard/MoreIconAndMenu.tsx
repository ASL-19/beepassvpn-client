import { css } from "@emotion/react";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FC, Fragment, memo, useCallback, useRef, useState } from "react";

import {
  Language,
  Server,
  useLocaleCode,
  useStrings,
} from "../../stores/appStore";
import MoreSvg from "../icons/MoreSvg";

import ForgetServerDialog from "src/components/serverCard/ForgetServerDialog";
import RenameServerDialog from "src/components/serverCard/RenameServerDialog";

export type MoreIconAndMenuStrings = {
  serverMenuButtonA11yLabel: string;
};

type MoreIconAndMenuProps = {
  server: Server;
};

namespace styles {
  export const moreButton = (localeCode: Language) => css`
    position: absolute;
    top: 5px;
    ${localeCode === "fa" ? "left: 0px" : "right:0px"}
  `;
}

const MoreIconAndMenu: FC<MoreIconAndMenuProps> = memo(({ server }) => {
  const [renameServerDialogIsOpen, setRenameServerDialogIsOpen] =
    useState(false);
  const localeCode = useLocaleCode();
  const strings = useStrings();

  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const [forgetServerDialogIsOpen, setForgetServerDialogIsOpen] =
    useState(false);

  const openMenu = useCallback(() => {
    setMenuIsOpen(true);
  }, []);
  const closeMenu = useCallback(() => {
    setMenuIsOpen(false);
  }, []);

  const closeForgetConfirmationDialog = useCallback(() => {
    setForgetServerDialogIsOpen(false);
  }, []);

  const closeRenameServerDialog = useCallback(() => {
    setRenameServerDialogIsOpen(false);
  }, []);

  const onRenameMenuItemClick = useCallback(() => {
    setRenameServerDialogIsOpen(true);
    closeMenu();
  }, [closeMenu]);

  const onForgetMenuItemClick = useCallback(() => {
    setForgetServerDialogIsOpen(true);
    closeMenu();
  }, [closeMenu]);

  return (
    <Fragment>
      <IconButton
        css={styles.moreButton(localeCode)}
        onClick={openMenu}
        aria-label={strings.MoreIconAndMenu.serverMenuButtonA11yLabel}
        aria-expanded={!open}
        ref={menuButtonRef}
      >
        <MoreSvg />
      </IconButton>
      <Menu
        open={menuIsOpen}
        onClose={closeMenu}
        anchorEl={menuButtonRef.current}
        disableScrollLock={true}
      >
        <MenuItem onClick={onRenameMenuItemClick}>
          {strings.ServerCard.serverRename}
        </MenuItem>
        <MenuItem onClick={onForgetMenuItemClick}>
          {strings.ServerCard.serverForget}
        </MenuItem>
      </Menu>

      <RenameServerDialog
        close={closeRenameServerDialog}
        isOpen={renameServerDialogIsOpen}
        server={server}
      />

      <ForgetServerDialog
        close={closeForgetConfirmationDialog}
        isOpen={forgetServerDialogIsOpen}
        server={server}
      />
    </Fragment>
  );
});

MoreIconAndMenu.displayName = "MoreIconAndMenu";

export default MoreIconAndMenu;
