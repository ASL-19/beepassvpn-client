const openLandingPage = async ({
  headerName,
  landingPageEndpointUrl,
  serverIp,
}: {
  headerName: string;
  landingPageEndpointUrl: string;
  serverIp: string;
}) => {
  const isCordovaApp = ('cordova' in window && device.platform !== 'browser');

  let landingPageUrl: string;

  try {
    const landingPageResponse = await fetch(landingPageEndpointUrl, { headers: {
      [headerName]: serverIp,
    }});

    landingPageUrl = await landingPageResponse.text();
  } catch {
    console.error(`Couldn’t get landing page from "${landingPageEndpointUrl}"`);
    return;
  }

  if (!landingPageUrl.startsWith('http')) {
    console.warn(`Landing page server returned invalid URL "${landingPageUrl}"`);
    return;
  }

  setTimeout(() => {
    if (isCordovaApp) {
      window.open(landingPageUrl, '_system');
    } else {
      console.warn(`Landing page not implemented in Windows (Electron) or browser versions. Would have opened: "${landingPageUrl}"`);
    }
  }, 1000);
};

export default openLandingPage;
