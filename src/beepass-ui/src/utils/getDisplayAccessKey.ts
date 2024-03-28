import { isDynamicAccessKey } from "src/utils/serverUtilsShared";

const getDisplayAccessKey = (accessKey: string) => {
  try {
    const accessKeyUrl = new URL(
      accessKey.replace("ss://", "https://").replace("ssconf://", "https://"),
    );

    return isDynamicAccessKey(accessKey)
      ? accessKeyUrl.host // TODO: Use a different format for ssconf?
      : accessKeyUrl.host;
  } catch {
    return "";
  }
};

export default getDisplayAccessKey;
