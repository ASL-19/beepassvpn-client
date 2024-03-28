import { Button, Stack } from "@mui/material";
import { FC, memo } from "react";

import {
  buttonsContainer,
  cancelButton,
  confirmButton,
} from "src/components/PermissionDialog/ButtonGroupStyle";
import { ButtonGroupType } from "src/components/PermissionDialog/PermissionDialog";
import { useStrings } from "src/stores/appStore";

const DataCollectionButtonGroup: FC<ButtonGroupType> = memo(
  ({ close, onConfirmButtonClick, permissionDialogSharedStrings }) => {
    const strings = useStrings();
    return (
      <Stack css={buttonsContainer}>
        <>
          <Button
            onClick={onConfirmButtonClick}
            variant="contained"
            css={confirmButton}
          >
            {permissionDialogSharedStrings.agreeButton}
          </Button>
          <Button onClick={close} css={cancelButton}>
            {strings.shared.cancel}
          </Button>
        </>
      </Stack>
    );
  },
);

DataCollectionButtonGroup.displayName = "DataCollectionButtonGroup";

export default DataCollectionButtonGroup;
