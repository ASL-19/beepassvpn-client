import { useStrings } from "src/stores/appStore";
import { DotSeparatedStringKey } from "src/strings/stringTypes";
import getLanguageStringByDotSeparatedKey from "src/utils/getLanguageStringByDotSeparatedKey";

// Replace string variable ({variable}) with messageParams
const useLocalizedMessage = ({
  messageKey,
  messageParams,
}: {
  messageKey: DotSeparatedStringKey;
  messageParams?: { [key: string]: DotSeparatedStringKey | string };
}) => {
  const language = useStrings();

  // replace string variables with messageParams
  let newStringWithParams = getLanguageStringByDotSeparatedKey({
    dotSeparatedKey: messageKey,
    strings: language,
  });

  if (messageParams) {
    for (const key in messageParams) {
      // This is the same logic as getLanguageStringByDotSeparatedKey, but
      // without casting to string since messageParams[key] could be a StringKey
      // or a string.
      const languageString = messageParams[key]
        .split(".")
        .reduce((acc, keySegment) => acc[keySegment] ?? acc, language);

      const replacement =
        typeof languageString === "string"
          ? languageString
          : messageParams[key];

      newStringWithParams = newStringWithParams.replace(
        `{${key}}`,
        replacement,
      );
    }
  }

  return newStringWithParams;
};

export default useLocalizedMessage;
