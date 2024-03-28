import { cordova } from "src/utils/cordova";
import { electron } from "src/utils/electron";
import { fetchWithRetry } from "src/utils/fetchWithRetry";

export const openLandingPage = async ({ serverIp }: { serverIp: string }) => {
  let landingPageUrl: string;

  const fetchLandingPageUrl = async ({
    interval,
    retry,
  }: {
    interval?: number;
    retry: number;
  }) => {
    try {
      const landingPageResponse = await fetchWithRetry(
        import.meta.env.VITE_LANDING_PAGE_ENDPOINT,
        {
          headers: {
            [import.meta.env.VITE_LANDING_PAGE_IP_HEADER_NAME]: serverIp,
            [import.meta.env.VITE_LANDING_PAGE_TYPE_HEADER_NAME]: "1",
          },
        },
        retry,
        interval,
      );

      landingPageUrl = await landingPageResponse.text();
    } catch {
      console.error(
        `Couldn’t get landing page from "${
          import.meta.env.VITE_LANDING_PAGE_ENDPOINT
        }"`,
      );
      return;
    }

    if (!landingPageUrl.startsWith("http")) {
      console.warn(
        `Landing page server returned invalid URL "${landingPageUrl}"`,
      );
      return;
    }
  };

  if (import.meta.env.VITE_BUILD_TYPE === "cordova-native") {
    await fetchLandingPageUrl({ retry: 0 });
    setTimeout(() => {
      // @ts-expect-error (InAppBrowser not defined on MockCordova — can we fix this?)
      cordova.InAppBrowser.open(landingPageUrl, "_system");
    }, 2000);
  } else if (import.meta.env.VITE_BUILD_TYPE === "electron-native") {
    await fetchLandingPageUrl({ interval: 2000, retry: 5 });
    setTimeout(() => {
      electron.methodChannel.send("openLandingPage", landingPageUrl);
    }, 2000);
  } else {
    console.warn(
      `Landing page not implemented in mock versions. Would have opened: "${landingPageUrl}"`,
    );
  }
};
