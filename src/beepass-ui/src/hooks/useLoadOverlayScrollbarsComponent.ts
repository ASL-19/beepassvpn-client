import { useEffect } from "react";

import { useAppDispatch } from "src/stores/appStore";
import { platformSlug } from "src/values/platform";

const useLoadOverlayScrollbarsComponent = () => {
  const appDispatch = useAppDispatch();

  useEffect(() => {
    const loadOverlayScrollBarsComponentOnAndroid = async () => {
      if (platformSlug !== "android") {
        appDispatch({
          OverlayScrollbarsComponent: null,
          type: "overlayScrollbarsComponentUpdated",
        });
        return;
      }

      const OverlayScrollbarsComponent = (
        await import("overlayscrollbars-react")
      ).OverlayScrollbarsComponent;
      console.info("OverlayScrollbarsComponent: ", OverlayScrollbarsComponent);

      appDispatch({
        OverlayScrollbarsComponent,
        type: "overlayScrollbarsComponentUpdated",
      });
    };

    loadOverlayScrollBarsComponentOnAndroid();
  });
};

export default useLoadOverlayScrollbarsComponent;
