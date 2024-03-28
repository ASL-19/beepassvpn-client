import { DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { FC, memo, useCallback } from "react";

import FormattedMessage from "src/components/FormattedMessage";
import { useServerConnectionFunctions } from "src/hooks/useServerConnectionFunction";
import { Server, useStrings } from "src/stores/appStore";

const ForgetServerDialog: FC<{
  close: () => void;
  isOpen: boolean;
  server: Server;
}> = memo(({ close, isOpen, server }) => {
  const { ServerCard: serverCardStrings, shared: sharedStrings } = useStrings();

  const { forgetAndDisconnectFromServer } = useServerConnectionFunctions({
    server,
  });

  const onCancelButtonClick = useCallback(() => {
    close();
  }, [close]);

  const onConfirmButtonClick = async () => {
    await forgetAndDisconnectFromServer();

    close();
  };

  return (
    <Dialog open={isOpen} onClose={close} disableScrollLock={true}>
      <DialogTitle>
        <FormattedMessage
          messageKey="ServerCard.serverForgetAlertTitle"
          messageParams={{
            servername: server.name ?? serverCardStrings.serverDefaultName,
          }}
        />
      </DialogTitle>
      <DialogContent>
        <DialogActions>
          <Button onClick={onCancelButtonClick}>{sharedStrings.cancel}</Button>
          <Button onClick={onConfirmButtonClick} variant="contained">
            {serverCardStrings.serverForgetAlertConfirm}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
});

ForgetServerDialog.displayName = "ForgetServerDialog";

export default ForgetServerDialog;
