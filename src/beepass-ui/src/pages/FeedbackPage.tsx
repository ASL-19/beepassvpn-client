import { css } from "@emotion/react";
import { Button, Divider } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { ChangeEvent, memo, useCallback, useState } from "react";

import FormattedMessage from "../components/FormattedMessage";
import ScrollableContent from "../components/ScrollableContent";
import colors from "../style/colors";
import { cordovaReport } from "../utils/reporter";

import {
  Language,
  useAppDispatch,
  useLocaleCode,
  useStrings,
} from "src/stores/appStore";

export type FeedbackPageStrings = {
  emailFeedbackInput: string;
  feedbackCannotAddServer: string;
  feedbackConnection: string;
  feedbackGeneral: string;
  feedbackInput: string;
  feedbackLanguageDisclaimer: string;
  feedbackNoServer: string;
  feedbackPageTitle: string;
  feedbackPerformance: string;
  feedbackPrivacy: string;
  feedbackSuggestion: string;
  feedbackThanks: string;
  submit: string;
  submitting: string;
};

namespace styles {
  export const feedbackCard = css`
    width: calc(100% - 1rem);
    max-width: 34.375rem;
    margin: 0.5rem auto;

    border-radius: 2px;
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.23);
    a {
      text-decoration: underline;
    }
  `;
  export const feedbackCardContent = css`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1rem;
  `;
  export const feedbackInput = ({ error }: { error: boolean }) => css`
    width: 100%;
    textarea::placeholder {
      ${error && `opacity: 1; color: ${colors.redError}`}
    }
  `;
  export const infoContainer = css`
    color: ${colors.gray};
    font-weight: 300;
    font-size: 0.75rem;
    line-height: 1.25;
  `;
  export const dropdown = (localeCode: Language) => css`
    width: 100%;
    ${localeCode === "fa" &&
    css`
      svg {
        right: 95%;
      }
      div {
        padding-right: 0 !important;
      }
    `}
  `;
  export const buttonContainer = css`
    width: 100%;
    padding: 0.3125rem 1rem;

    text-align: right;
  `;
}
const FeedbackPage = memo(() => {
  const { FeedbackPage: strings } = useStrings();
  const localeCode = useLocaleCode();
  const appDispatch = useAppDispatch();
  const [feedbackSelection, setFeedbackSelection] = useState(
    strings.feedbackGeneral,
  );
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  const onSelectionChange = useCallback((e: SelectChangeEvent<string>) => {
    setFeedbackSelection(e.target.value);
  }, []);

  const handleEmailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEmail(e.target.value);
    },
    [],
  );

  const handleFeedbackChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFeedback(e.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (feedback.length === 0) {
      setFeedbackError(true);
    } else {
      cordovaReport({
        feedbackCategory: feedbackSelection,
        userEmail: email,
        userFeedback: feedback,
      })
        .then(() => {
          // TODO:display `feedback thanks`
          setEmail("");
          setFeedbackSelection(strings.feedbackGeneral);
          setFeedback("");
        })
        .catch((error) => {
          appDispatch({
            error,
            type: "add_error_message",
          });
        });
    }
  }, [
    email,
    feedback,
    feedbackSelection,
    strings.feedbackGeneral,
    appDispatch,
  ]);
  return (
    <ScrollableContent>
      <div css={styles.feedbackCard}>
        <div css={styles.feedbackCardContent}>
          <Select
            variant="standard"
            value={feedbackSelection}
            defaultValue={strings.feedbackGeneral}
            onChange={onSelectionChange}
            css={styles.dropdown(localeCode)}
          >
            <MenuItem value={strings.feedbackGeneral}>
              {strings.feedbackGeneral}
            </MenuItem>
            <MenuItem value={strings.feedbackNoServer}>
              {strings.feedbackNoServer}
            </MenuItem>
            <MenuItem value={strings.feedbackCannotAddServer}>
              {strings.feedbackCannotAddServer}
            </MenuItem>
            <MenuItem value={strings.feedbackConnection}>
              {strings.feedbackConnection}
            </MenuItem>
            <MenuItem value={strings.feedbackPerformance}>
              {strings.feedbackPerformance}
            </MenuItem>
            <MenuItem value={strings.feedbackSuggestion}>
              {strings.feedbackSuggestion}
            </MenuItem>
          </Select>
          <TextField
            variant="standard"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder={strings.emailFeedbackInput}
            css={css`
              width: 100%;
              margin-top: 20px;
            `}
          />
          <TextField
            placeholder={strings.feedbackInput}
            error={feedbackError}
            multiline
            rows={3}
            variant="standard"
            value={feedback}
            onChange={handleFeedbackChange}
            css={styles.feedbackInput({ error: feedbackError })}
          />
          <div css={styles.infoContainer}>
            <FormattedMessage
              messageKey="FeedbackPage.feedbackPrivacy"
              messageParams={{
                privacyPolicyLinkClose: "</a>",
                privacyPolicyLinkOpen:
                  "<a href=https://s3.amazonaws.com/outline-vpn/index.html#/en/support/dataCollection>",
              }}
              htmlString
            />
          </div>
        </div>
        <Divider />
        <div css={styles.buttonContainer}>
          <Button
            css={css`
              color: ${colors.blackText};
            `}
            onClick={handleSubmit}
          >
            {strings.submit}
          </Button>
        </div>
      </div>
    </ScrollableContent>
  );
});

FeedbackPage.displayName = "FeedbackPage";

export default FeedbackPage;
