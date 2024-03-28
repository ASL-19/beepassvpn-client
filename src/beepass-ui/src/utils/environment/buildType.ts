import { makeValidator } from "envalid";

/**
 * Validate that environment variable is a build type.
 *
 * The values in this must be manually synchronized with the index.html’s
 * buildType JSDoc comment.
 *
 * Envalid custom validator (https://github.com/af/envalid#custom-validators)
 */
const buildType = makeValidator((s) => {
  if (
    s === "cordova-mock" ||
    s === "cordova-native" ||
    s === "electron-mock" ||
    s === "electron-native"
  ) {
    return s;
  }

  throw new Error(
    'Must be "cordova-mock", "cordova-native", "electron-mock", or "electron-native"',
  );
});

export default buildType;
