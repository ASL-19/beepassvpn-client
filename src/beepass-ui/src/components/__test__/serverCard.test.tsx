import { screen } from "@testing-library/react";
import { vi } from "vitest";
import { expect, test } from "vitest";

import ServeCard from "../serverCard/ServeCard";

import serverTestDataById from "src/testData/serverTestDataById";
import getDisplayAccessKey from "src/utils/getDisplayAccessKey";
import getLanguageStrings from "src/utils/getLanguageStrings";
import testRender from "src/utils/test/testRender";

const language = "en";

const strings = getLanguageStrings(language);

const renderServerCard = async () =>
  await testRender({
    element: (
      <ServeCard
        server={serverTestDataById.custom1}
        openAutoConnectModalIfNeeded={vi.fn()}
      />
    ),
    mockAppStateOverrides: {
      servers: [serverTestDataById.custom1],
    },
  });

test("Test on serverCard component layout", async () => {
  await renderServerCard();

  const customServerDisplayAccessKey = getDisplayAccessKey(
    serverTestDataById.custom1.accessKey,
  );

  expect(screen.getByText(serverTestDataById.custom1.name)).toBeInTheDocument();
  expect(screen.getByText(customServerDisplayAccessKey)).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: strings.ServerCard.connectButtonLabel,
    }),
  ).toBeInTheDocument();
});

test("Test on connecting and disconnecting a server", async () => {
  const { user } = await renderServerCard();
  // click on connect button
  const connectButton = screen.getByRole("button", {
    name: strings.ServerCard.connectButtonLabel,
  });
  await user.click(connectButton);

  // Note: We don’t check the connecting state since after implementing the
  // setTestSafeTimeout util in the mock methods the connecting state is so
  // short Jest can’t see it(?)

  // const connectingStatus = await screen.findByText(
  //   strings.ServerCard.connectingServerState,
  // );
  // expect(connectingStatus).toBeInTheDocument();

  // connect successfully
  await screen.findByRole("button", {
    name: strings.ServerCard.disconnectButtonLabel,
  });
  const connectedStatus = await screen.findByText(
    strings.ServerCard.connectedServerState,
    { exact: false },
  );
  expect(connectedStatus).toBeInTheDocument();
});

test("Testing on more button and modal layout", async () => {
  const { user } = await renderServerCard();
  const moreButton = screen.getByLabelText(
    strings.MoreIconAndMenu.serverMenuButtonA11yLabel,
  );
  await user.click(moreButton);
  expect(screen.getByRole("presentation")).toBeInTheDocument();

  // click on rename button
  const renameButton = screen.getByRole("menuitem", {
    name: strings.ServerCard.serverRename,
  });
  await user.click(renameButton);

  // rename modal layout
  const renameInput = screen.getByRole("textbox");
  const saveButton = screen.getByRole("button", {
    name: strings.shared.save,
  });
  const cancelButton = screen.getByRole("button", {
    name: strings.shared.cancel,
  });
  expect(renameInput).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();

  // test on rename input field
  await user.clear(renameInput);
  expect(renameInput).toHaveValue("");
  await user.type(renameInput, "Renamed Server");
  expect(renameInput).toHaveValue("Renamed Server");
});
