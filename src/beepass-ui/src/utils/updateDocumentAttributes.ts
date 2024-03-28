import { match } from "ts-pattern";

const updateDocumentAttributes = (language: string) => {
  const { dir, lang } = match(language)
    .with("fa", () => ({ dir: "rtl", lang: "fa" }))
    .otherwise(() => ({ dir: "ltr", lang: "en" }));

  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lang);

  document.documentElement.setAttribute(
    "class",
    `${dir} ${lang} ${window?.cordova?.platformId ?? ""}`.trim(),
  );
};

export default updateDocumentAttributes;
