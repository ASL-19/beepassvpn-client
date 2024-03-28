import { useEffect } from "react";

import { platformSlug } from "src/values/platform";

const useAndroidExitAppOnBackButton = () => {
  useEffect(() => {
    const onBackButton = (event: Event) => {
      event.preventDefault();
      navigator.app.exitApp();
    };

    if (platformSlug === "android") {
      document.addEventListener("backbutton", onBackButton);
    }

    return () => {
      document.removeEventListener("backbutton", onBackButton);
    };
  }, []);
};

export default useAndroidExitAppOnBackButton;
