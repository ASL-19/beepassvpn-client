import { FC, Fragment, memo } from "react";

import useLocalizedMessage from "../hooks/useLocalizedMessage";

import { DotSeparatedStringKey, StringKey } from "src/strings/stringTypes";

// Build similar lightweight component as
// https://formatjs.io/docs/react-intl/components#formattedmessage
type FormattedMessageProps = {
  htmlString?: boolean;
  messageKey: DotSeparatedStringKey;
  messageParams?: { [key: string]: StringKey };
};

const FormattedMessage: FC<FormattedMessageProps> = memo(
  ({ htmlString, messageKey, messageParams }) => {
    const localizedString = useLocalizedMessage({
      messageKey,
      messageParams,
    });

    return (
      <Fragment>
        {htmlString ? (
          <div dangerouslySetInnerHTML={{ __html: localizedString || "" }} />
        ) : (
          localizedString
        )}
      </Fragment>
    );
  },
);

FormattedMessage.displayName = "FormattedMessage";

export default FormattedMessage;
