import { css } from "@emotion/react";
import { Button } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import TextField from "@mui/material/TextField";
import { ChangeEvent, FC, FormEvent, memo, useCallback, useState } from "react";
import uuidv4 from "uuidv4";

import { useAddServerModalContext } from "../hooks/useAddServerModalContext";
import { useAccessKeyValidity } from "../hooks/useValidAccessKey";
import colors from "../style/colors";
import FormattedMessage from "./FormattedMessage";
import KeySvg from "./icons/KeySvg";

import LinksGroupButton from "src/components/LinksGroupButton";
import { useAppDispatch, useStrings } from "src/stores/appStore";

// TODO
// 1. Add text string
// 2. validateAccessKey function could throw different errors(access key format
//    error, server already added...), need to display different error message
//    for different cases, the original design and app only display "invalid
//    access key" doesn't give more details.

export type AddServerModalStrings = {
  serverAccessKeyDetected: string;
  serverAccessKeyLabel: string;
  serverAdd: string;
  serverAddAccessKey: string;
  serverAddAlreadyAdded: string;
  serverAddIgnore: string;
  serverAddInstructions: string;
  serverAddInvalid: string;
  serverAddNoServersLabel: string;
  serverAddZeroStateInstructions: string;
  serverCreateYourOwn: string;
  serverCreateYourOwnZeroState: string;
  serverDetected: string;
};

namespace styles {
  export const overrideDrawerLayout = css`
    .MuiPaper-root {
      box-sizing: border-box;
      min-width: 18.5rem;

      border-top-left-radius: 20px !important;
      border-top-right-radius: 20px !important;
    }
  `;

  export const modalContainer = css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding-top: 1.37rem;

    background-color: white;
  `;

  export const modalInfoTitleContainer = css`
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    align-items: center;
    justify-content: center;
    width: calc(100% - 1.5rem);
  `;

  export const modalTitle = css`
    width: 100%;
    min-width: 18.5rem;

    font-weight: 600;
    font-size: 1.375rem;
    line-height: 1.45;
    text-align: center;
  `;

  export const modalDescription = css`
    width: 100%;
    min-width: 18.5rem;

    color: ${colors.lightGray};
    font-size: 0.875rem;
    line-height: 1.4;
    text-align: center;
  `;

  export const accessKeyInput = (validAccessKey: boolean) => css`
    width: 100%;
    min-width: 18.5rem;
    /* overwrite material input style */
    .MuiInputBase-root {
      height: 3.75rem;

      background-color: ${colors.inputBackgroundGray};

      color: ${!validAccessKey && `${colors.redError}`};
    }
  `;

  export const modalButtonGroupSection = css`
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    padding: 1rem 0;

    background-color: ${colors.inputBackgroundGray};
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  `;

  export const errorMessage = css`
    padding-bottom: 1.25rem;

    color: ${colors.lightGray};
    font-size: 0.875rem;
    line-height: 1.4;
    text-align: center;

    .invalid {
      color: ${colors.redError};
    }
  `;

  export const serverButton = css`
    background-color: ${colors.blueNeon} !important;
  `;

  export const addServerButtonGroup = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - 3rem);
    margin-bottom: 1.5rem;
  `;

  export const keySvg = css`
    margin-inline-start: 0.625rem;
    margin-inline-end: 0.625rem;
  `;
}

const AddServerModal: FC = memo(() => {
  const appDispatch = useAppDispatch();
  const { addServerModalOpen, onClose } = useAddServerModalContext();
  const { AddServerModal: strings } = useStrings();

  const [accessKey, setAccessKey] = useState("");

  // when accesskey input changes, validate access key.
  const accessKeyValidity = useAccessKeyValidity({
    accessKey,
  });

  const handleAddServer = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (accessKeyValidity.isValid) {
        const name = accessKey.split("#")[1] || undefined;

        appDispatch({
          newServer: {
            accessKey,
            connectionState: "disconnected",
            id: uuidv4(),
            isDefaultServer: false,
            name,
          },
          type: "add_server",
        });
        setAccessKey("");
        onClose();
      }
    },
    [accessKey, accessKeyValidity.isValid, appDispatch, onClose],
  );

  const handleAccessKeyChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setAccessKey(e.target.value);
    },
    [setAccessKey],
  );

  return (
    <Drawer
      anchor="bottom"
      open={addServerModalOpen}
      onClose={onClose}
      css={styles.overrideDrawerLayout}
      disableScrollLock={true}
    >
      <form css={styles.modalContainer} onSubmit={handleAddServer}>
        <div css={styles.modalInfoTitleContainer}>
          <div css={styles.modalTitle}>{strings.serverAddAccessKey}</div>
          <p css={styles.modalDescription}>{strings.serverAddInstructions}</p>
          <TextField
            error={!accessKeyValidity.isValid}
            variant="standard"
            fullWidth
            css={styles.accessKeyInput(accessKeyValidity.isValid)}
            placeholder={strings.serverAccessKeyLabel}
            value={accessKey}
            onChange={handleAccessKeyChange}
            InputProps={{
              startAdornment: <KeySvg css={styles.keySvg} />,
            }}
          />
        </div>

        {!accessKeyValidity.isValid || accessKey.length === 0 ? (
          <div css={styles.modalButtonGroupSection}>
            <div css={styles.modalDescription}>
              {!accessKey && strings.serverCreateYourOwn}
            </div>
            <LinksGroupButton />
            {accessKeyValidity.isValid === false && (
              <div css={styles.errorMessage}>
                <FormattedMessage
                  messageKey={
                    accessKeyValidity.reasonCode === "alreadyAdded"
                      ? "AddServerModal.serverAddAlreadyAdded"
                      : "AddServerModal.serverAddInvalid"
                  }
                  messageParams={{
                    closeLine: "</div>",
                    openLine: `<div class="invalid">`,
                  }}
                  htmlString
                />
              </div>
            )}
          </div>
        ) : (
          <div css={styles.addServerButtonGroup}>
            <Button onClick={onClose}>{strings.serverAddIgnore}</Button>
            <Button variant="contained" css={styles.serverButton} type="submit">
              {strings.serverAdd}
            </Button>
          </div>
        )}
      </form>
    </Drawer>
  );
});

AddServerModal.displayName = "AddServerModal";

export default AddServerModal;
