import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import ServersPage from "src/pages/ServersPage";
import getLanguageStrings from "src/utils/getLanguageStrings";
import { setLocalStorageValue } from "src/utils/localStorage";
import testRender from "src/utils/test/testRender";

const localeCode = "en";

const strings = getLanguageStrings(localeCode);

const renderEmptyServer = () => {
  setLocalStorageValue({ key: "onboardingCompleted", value: true });

  return testRender({
    element: <ServersPage />,
    mockAppStateOverrides: {
      servers: [],
    },
  });
};

const showupModal = async () => {
  const view = await renderEmptyServer();
  const addAServerButton = await screen.findByRole("button", {
    name: strings.AddServerModal.serverAddZeroStateInstructions,
  });
  expect(addAServerButton).toBeInTheDocument();
  await view.user.click(addAServerButton);

  return view;
};

const typeAccesskey = async ({ accesskey }: { accesskey: string }) => {
  const view = await showupModal();
  const accesskeyInput = screen.getByPlaceholderText(
    strings.AddServerModal.serverAccessKeyLabel,
  ) as HTMLInputElement;
  await view.user.type(accesskeyInput, accesskey);

  return view;
};

const accesskey =
  "ss://Y2hhY2hhMjAtaWV0Zi1wb2x5MTMwNTpMUXIwU0FYcEZGYmY=@54.39.96.133:32296/?outline=1";

test("User clicks on Add a server button should pop up AddServerModal", async () => {
  await showupModal();
  // By default AddServerModal should contain a title and input
  const addServerModalTitle = await screen.findByText(
    strings.AddServerModal.serverAddAccessKey,
  );
  expect(addServerModalTitle).toBeInTheDocument();

  const accesskeyInput = await screen.findByPlaceholderText(
    strings.AddServerModal.serverAccessKeyLabel,
  );
  expect(accesskeyInput).toBeInTheDocument();
});

describe("With valid access key input", () => {
  test("Should display ADD SERVER button and IGNORE button", async () => {
    await typeAccesskey({ accesskey });

    const addServerButton = screen.getByRole("button", {
      name: strings.AddServerModal.serverAdd,
    });
    expect(addServerButton).toBeInTheDocument();

    const cancelButton = screen.getByRole("button", {
      name: strings.AddServerModal.serverAddIgnore,
    });
    expect(cancelButton).toBeInTheDocument();
  });

  test("Click on ADD SERVER button should add a new server on ServersPage", async () => {
    const { user } = await typeAccesskey({ accesskey });

    const addServerButton = screen.getByRole("button", {
      name: strings.AddServerModal.serverAdd,
    });

    await user.click(addServerButton);

    // Add server modal should disappear after click ADD SERVER button
    screen.queryByText(strings.AddServerModal.serverAddAccessKey);

    const serverItem = await screen.findByRole("listitem");
    expect(serverItem).toBeInTheDocument();
  });

  test("Click on IGNORE button, AddServer modal should be disappeared", async () => {
    const { user } = await typeAccesskey({ accesskey });

    const ignoreButton = screen.getByRole("button", {
      name: strings.AddServerModal.serverAddIgnore,
    });

    await user.click(ignoreButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByText(strings.AddServerModal.serverAddAccessKey),
    );
  });
});

describe("With invalid access key", () => {
  test("Should display error message, clean up invalid access key should back to default layout", async () => {
    const { user } = await typeAccesskey({ accesskey: "invalid accesskey" });

    const invalidAccessKeyFirstLine =
      strings.AddServerModal.serverAddInvalid.match(
        /{openLine}(?<firstLine>.*){closeLine}/,
      ).groups.firstLine;

    // TODO: build a util function for strings in special case which needs htmlStrings and messageParams
    // Or just simply use getByText to
    const errorMessage = screen.getByText(invalidAccessKeyFirstLine);
    expect(errorMessage).toBeInTheDocument();

    const accesskeyInput = screen.getByPlaceholderText(
      strings.AddServerModal.serverAccessKeyLabel,
    ) as HTMLInputElement;
    await user.clear(accesskeyInput);
    expect(errorMessage).not.toBeInTheDocument();
  });
});
