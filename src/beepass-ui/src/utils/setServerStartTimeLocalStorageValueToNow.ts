import { setLocalStorageValue } from "src/utils/localStorage";

const setServerStartTimeLocalStorageValueToNow = () => {
  const now = Math.floor(Date.now() / 1000);
  setLocalStorageValue({ key: "serverStartTime", value: now });
};

export default setServerStartTimeLocalStorageValueToNow;
