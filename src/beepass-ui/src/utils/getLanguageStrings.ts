import { match } from "ts-pattern";

import { Language } from "src/stores/appStore";
import enStrings from "src/strings/enStrings";
import faStrings from "src/strings/faStrings";

const getLanguageStrings = (language: Language) =>
  match(language)
    .with("en", () => enStrings)
    .with("fa", () => faStrings)
    .exhaustive();

export default getLanguageStrings;
