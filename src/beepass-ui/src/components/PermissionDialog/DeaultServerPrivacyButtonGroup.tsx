import { Button, Stack } from "@mui/material";
import { FC, memo } from "react";
import { match } from "ts-pattern";

import {
  buttonsContainer,
  cancelButton,
  confirmButton,
} from "src/components/PermissionDialog/ButtonGroupStyle";
import { ButtonGroupType } from "src/components/PermissionDialog/PermissionDialog";
import { useStrings } from "src/stores/appStore";

const DefaultServerPrivacyButtonGroup: FC<ButtonGroupType> = memo(
  ({ close, onConfirmButtonClick, permissionDialogSharedStrings, variant }) => {
    const strings = useStrings();
    return (
      <Stack css={buttonsContainer}>
        {match(variant)
          .with("confirmation", () => (
            <>
              <Button
                onClick={onConfirmButtonClick}
                variant="contained"
                css={confirmButton}
              >
                {permissionDialogSharedStrings.connectAnywayButton}
              </Button>
              <Button onClick={close} css={cancelButton}>
                {strings.shared.cancel}
              </Button>
            </>
          ))
          .with("info", () => (
            <Button variant="contained" css={confirmButton} onClick={close}>
              {permissionDialogSharedStrings.understandButton}
            </Button>
          ))
          .exhaustive()}
      </Stack>
    );
  },
);

DefaultServerPrivacyButtonGroup.displayName = "DefaultServerPrivacyButtonGroup";

export default DefaultServerPrivacyButtonGroup;
