import { DotSeparatedStringKey, Strings } from "src/strings/stringTypes";

const getLanguageStringByDotSeparatedKey = ({
  dotSeparatedKey,
  strings,
}: {
  dotSeparatedKey: DotSeparatedStringKey;
  strings: Strings;
}) =>
  dotSeparatedKey
    .split(".")
    .reduce((acc, keySegment) => acc[keySegment], strings) as string;

export default getLanguageStringByDotSeparatedKey;
