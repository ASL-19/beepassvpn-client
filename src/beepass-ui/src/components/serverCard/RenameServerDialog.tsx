import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { FC, memo, useCallback, useMemo, useRef } from "react";

import { Server, useAppDispatch, useStrings } from "src/stores/appStore";

const RenameServerDialog: FC<{
  close: () => void;
  isOpen: boolean;
  server: Server;
}> = memo(({ close, isOpen, server }) => {
  const { ServerCard: strings, shared: sharedStrings } = useStrings();
  const dispatch = useAppDispatch();

  const nameRef = useRef<HTMLInputElement>();

  const serverName = useMemo(
    () => server.name ?? strings.serverDefaultName,
    [server.name, strings.serverDefaultName],
  );

  const onCancelButtonClick = useCallback(() => {
    close();
  }, [close]);

  const onRenameButtonClick = useCallback(() => {
    const newName = nameRef.current.value || strings.serverDefaultName;
    if (serverName !== newName) {
      dispatch({
        id: server.id,
        newName,
        type: "rename_server",
      });
    }
    close();
  }, [close, dispatch, server.id, serverName, strings]);

  return (
    <Dialog open={isOpen} onClose={close} disableScrollLock={true}>
      <DialogTitle>{strings.serverRename}</DialogTitle>

      <DialogContent>
        <TextField
          inputRef={nameRef}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={true}
          variant="standard"
          defaultValue={serverName}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancelButtonClick}>{sharedStrings.cancel}</Button>
        <Button onClick={onRenameButtonClick}>{sharedStrings.save}</Button>
      </DialogActions>
    </Dialog>
  );
});

RenameServerDialog.displayName = "RenameServerDialog";

export default RenameServerDialog;
