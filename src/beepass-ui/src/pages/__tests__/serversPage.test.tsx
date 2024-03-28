import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import { expect, test } from "vitest";

import ServersPage from "../ServersPage";

import { Server } from "src/stores/appStore";
import serverTestDataById from "src/testData/serverTestDataById";
import getLanguageStrings from "src/utils/getLanguageStrings";
import getPersistedServers from "src/utils/getPersistedServers";
import testRender from "src/utils/test/testRender";

const defaultServersCount = 1;
const userServersCount = 3;

/** Default server + 3 fake servers */
const serversCount = defaultServersCount + userServersCount;

const language = "en";

const strings = getLanguageStrings(language);

const renderServersPage = () => {
  // setLocalStorageValue({ key: "onboardingCompleted", value: true });

  return testRender({
    element: <ServersPage />,
    mockAppStateOverrides: {
      servers: getPersistedServers().map((server) => ({
        ...server,
        connectionState: "disconnected",
      })),
    },
  });
};

const getServerNames = (servers: Array<Server>) =>
  servers.map(
    (server) =>
      server.name ??
      (server.isDefaultServer
        ? strings.ServerCard.defaultServerName
        : strings.ServerCard.serverDefaultName),
  );

const testServerNames = getServerNames(
  Object.values(serverTestDataById).filter((server) => !server.isDefaultServer),
);

test("By default servers page has default server + 3 fake servers", async () => {
  await renderServersPage();
  expect(await screen.findByText(testServerNames[0])).toBeInTheDocument();
  expect(await screen.findByText(testServerNames[1])).toBeInTheDocument();
  expect(await screen.findByText(testServerNames[2])).toBeInTheDocument();
  expect(
    await screen.findAllByRole("button", {
      name: strings.ServerCard.connectButtonLabel,
    }),
  ).toHaveLength(serversCount);
});

test("Rename a server", async () => {
  const { user } = await renderServersPage();

  const moreButtons = await screen.findAllByLabelText(
    strings.MoreIconAndMenu.serverMenuButtonA11yLabel,
  );
  expect(moreButtons).toHaveLength(userServersCount);

  for (const [index, moreButton] of moreButtons.entries()) {
    // click more icon button to open rename modal
    await user.click(moreButton);
    const renameButton = screen.getByRole("menuitem", {
      name: strings.ServerCard.serverRename,
    });
    await user.click(renameButton);

    // by default rename input field has current server name
    const renameInput = screen.getByRole("textbox");
    expect(renameInput).toHaveValue(testServerNames[index]);

    // input new server name
    await user.clear(renameInput);
    expect(renameInput).toHaveValue("");
    await user.type(renameInput, `Renamed Server ${index}`);
    expect(renameInput).toHaveValue(`Renamed Server ${index}`);

    // After save, modal should disappear, server card name should be updated
    const saveButton = screen.getByRole("button", {
      name: strings.shared.save,
    });
    await user.click(saveButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("button", {
        name: strings.shared.save,
      }),
    );
    expect(
      screen.queryByRole("button", {
        name: strings.shared.cancel,
      }),
    ).not.toBeInTheDocument();

    await screen.findByText(`Renamed Server ${index}`);
  }
});

test("By default if server's name is empty, should use default name", async () => {
  const { user } = await renderServersPage();

  const moreButtons = await screen.findAllByLabelText(
    strings.MoreIconAndMenu.serverMenuButtonA11yLabel,
  );
  expect(moreButtons).toHaveLength(userServersCount);

  for (const moreButton of moreButtons) {
    // click more icon button to open rename modal
    await user.click(moreButton);
    const renameButton = screen.getByRole("menuitem", {
      name: strings.ServerCard.serverRename,
    });
    await user.click(renameButton);

    // clear input
    const renameInput = screen.getByRole("textbox");
    await user.clear(renameInput);
    expect(renameInput).toHaveValue("");

    // After save, modal disappeared, serverCard's name should be updated
    const saveButton = screen.getByRole("button", {
      name: strings.shared.save,
    });
    await user.click(saveButton);

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("button", {
        name: strings.shared.save,
      }),
    );
    expect(
      screen.queryByRole("button", {
        name: strings.shared.cancel,
      }),
    ).not.toBeInTheDocument();
  }

  await screen.findAllByText(strings.ServerCard.serverDefaultName);
});

test("Rename a server, if click on cancel button, server's name remains unchanged", async () => {
  const { user } = await renderServersPage();

  const moreButtons = await screen.findAllByLabelText(
    strings.MoreIconAndMenu.serverMenuButtonA11yLabel,
  );
  expect(moreButtons).toHaveLength(userServersCount);

  for (const [index, moreButton] of moreButtons.entries()) {
    // if (testServerNames[index] === strings.ServerCard.defaultServerName) {
    //   continue;
    // }

    // click more icon button to open rename modal
    await user.click(moreButton);
    const renameButton = screen.getByRole("menuitem", {
      name: strings.ServerCard.serverRename,
    });
    await user.click(renameButton);

    // by default rename input field has current server's name
    const renameInput = screen.getByRole("textbox");
    expect(renameInput).toHaveValue(testServerNames[index]);

    // input new server name
    await user.clear(renameInput);
    expect(renameInput).toHaveValue("");
    await user.type(renameInput, `Renamed Server ${index}`);
    expect(renameInput).toHaveValue(`Renamed Server ${index}`);

    // After save, serverCard's name should be updated
    const cancelButton = screen.getByRole("button", {
      name: strings.shared.cancel,
    });
    await user.click(cancelButton);
  }
  // server's name should be unchanged
  testServerNames.forEach((fakeName) => {
    expect(screen.getByText(fakeName)).toBeInTheDocument();
  });
});

test("Forget a server", async () => {
  const { user } = await renderServersPage();

  const moreButtons = await screen.findAllByLabelText(
    strings.MoreIconAndMenu.serverMenuButtonA11yLabel,
  );
  expect(moreButtons).toHaveLength(userServersCount);

  for (const [index, moreButton] of moreButtons.entries()) {
    // click more icon button to forget a server
    await user.click(moreButton);
    const forgetButton = screen.getByRole("menuitem", {
      name: strings.ServerCard.serverForget,
    });
    await user.click(forgetButton);

    // Forget confirmation dialog should show up
    const forgetAlertTitleText =
      strings.ServerCard.serverForgetAlertConfirm.replace(
        "{servername}",
        testServerNames[index],
      );

    const forgetAlertTitle = await screen.findByText(forgetAlertTitleText);
    expect(forgetAlertTitle).toBeInTheDocument();

    // Click on Confirm button to delete server
    const forgetAlertConfirmButton = screen.getByRole("button", {
      name: strings.ServerCard.serverForgetAlertConfirm,
    });
    await user.click(forgetAlertConfirmButton);

    // Forget confirmation dialog should disappear
    expect(screen.queryByText(forgetAlertTitleText)).not.toBeInTheDocument();
  }

  // serverList should be empty
  expect(
    screen.queryByText(strings.MoreIconAndMenu.serverMenuButtonA11yLabel),
  ).not.toBeInTheDocument();
});

test("Forget a server, if click on cancel button, server remains unchanged", async () => {
  const { user } = await renderServersPage();

  const moreButtons = await screen.findAllByLabelText(
    strings.MoreIconAndMenu.serverMenuButtonA11yLabel,
  );
  expect(moreButtons).toHaveLength(userServersCount);

  for (const [index, moreButton] of moreButtons.entries()) {
    // click more icon button to forget a server
    await user.click(moreButton);
    const forgetButton = screen.getByRole("menuitem", {
      name: strings.ServerCard.serverForget,
    });
    await user.click(forgetButton);

    const forgetAlertTitleText =
      strings.ServerCard.serverForgetAlertConfirm.replace(
        "{servername}",
        testServerNames[index],
      );

    const forgetAlertTitle = await screen.findByText(forgetAlertTitleText);
    expect(forgetAlertTitle).toBeInTheDocument();

    // Click on cancel
    const forgetAlertCancelButton = screen.getByRole("button", {
      name: strings.shared.cancel,
    });
    await user.click(forgetAlertCancelButton);

    // Forget confirmation dialog should disappear
    await waitForElementToBeRemoved(() =>
      screen.queryByText(forgetAlertTitleText),
    );
  }

  // serverList should be empty
  expect(
    screen.queryAllByLabelText(
      strings.MoreIconAndMenu.serverMenuButtonA11yLabel,
    ),
  ).toHaveLength(userServersCount);
});
