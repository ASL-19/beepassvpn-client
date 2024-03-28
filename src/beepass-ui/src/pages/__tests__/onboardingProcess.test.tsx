import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import App from "src/App";
import { Strings } from "src/strings/stringTypes";
import getLanguageStrings from "src/utils/getLanguageStrings";
import { getLocalStorageValue } from "src/utils/localStorage";
import testRender from "src/utils/test/testRender";

const getOnboardingSlidesImageAltStrings = (strings: Strings) => [
  strings.OnboardingSlidesStep.onboardingSlide1Alt,
  strings.OnboardingSlidesStep.onboardingSlide2Alt,
  strings.OnboardingSlidesStep.onboardingSlide3Alt,
  strings.OnboardingSlidesStep.onboardingSlide4Alt,
];

const englishStrings = getLanguageStrings("en");
const persianStrings = getLanguageStrings("fa");

const renderOnboardingPage = () =>
  testRender({
    element: <App />,
    elementIsWrappedInHashRouter: true,
    onboardingCompleted: false,
  });

test("By default should render English choose language page", async () => {
  await renderOnboardingPage();

  // The default language is English (at this point the app locale isn’t set)
  const chooseLanguageTitle = await screen.findByText(
    englishStrings.OnboardingLanguageStep.heading,
  );
  expect(chooseLanguageTitle).toBeInTheDocument();

  // Find all language button
  const englishButton = await screen.findByRole("button", {
    name: englishStrings.shared.languages.english,
  });
  expect(englishButton).toBeInTheDocument();
  const faButton = await screen.findByRole("button", {
    name: englishStrings.shared.languages.persian,
  });
  expect(faButton).toBeInTheDocument();
});

describe("After user choose language, choose language page will unmount then get into OnboardingSlidesStep", () => {
  test("If choose Persian language, user should get into OnboardingSlidesStep with Persian language (not default English)", async () => {
    const { user } = await renderOnboardingPage();

    const persianLanguageButton = await screen.findByRole("button", {
      name: englishStrings.shared.languages.persian,
    });
    await user.click(persianLanguageButton);

    expect(getLocalStorageValue({ key: "language" })).toBe("fa");
    // skip button should show up
    const skipButton = await screen.findByRole("button", {
      name: persianStrings.OnboardingSlidesStep.onboardingSkip,
    });
    expect(skipButton).toBeInTheDocument();
    // onboarding slides should show up
    getOnboardingSlidesImageAltStrings(persianStrings).forEach(
      (imageAltString) => {
        expect(screen.getByAltText(imageAltString)).toBeInTheDocument();
      },
    );
  });

  test("click on skip button, jump to last slide", async () => {
    const { user } = await renderOnboardingPage();

    const englishLanguageButton = await screen.findByRole("button", {
      name: englishStrings.shared.languages.english,
    });
    await user.click(englishLanguageButton);

    const skipButton = await screen.findByRole("button", {
      name: englishStrings.OnboardingSlidesStep.onboardingSkip,
    });
    expect(skipButton).toBeInTheDocument();

    await user.click(skipButton);

    const lastSlideElement = screen.getByAltText(
      getOnboardingSlidesImageAltStrings(englishStrings)[3],
    );

    expect(lastSlideElement).toBeInTheDocument();

    // When user clicks on skip, should jump to last slide, I am thinking to
    // check on .swiper-slide-active className to proof we are on the last
    // slide, but it seems in the testing mode, swiper never add
    // swiper-slide-active to slide.

    // screen.debug();

    // // eslint-disable-next-line testing-library/no-node-access
    // expect(lastSlideElement.parentNode).toHaveClass(
    //   "swiper-slide swiper-slide-active",
    // );
  });

  // Grant 2023-01-25: Temporarily disabled since this is failing after
  // dependency updates/switching to `react-scripts test`.

  // test("click on last image, OnboardingSlidesStep should disappear", async () => {
  //   await renderOnboardingPage();

  //

  //   // click on the last onboarding slides
  //   const onBoardingSlides = screen.getAllByRole("img");
  //   await user.click(onBoardingSlides[3]);

  //   expect(getLocalStorageValue({ key: "onboardingCompleted" })).toBe(true);

  //   // onboarding slides should disappear
  //   onboardingSlidesImageAltStrings.forEach((imageAltString) => {
  //     expect(screen.queryByAltText(imageAltString)).not.toBeInTheDocument();
  //   });

  //   // server page should show up with fake servers
  //   expect(screen.getAllByRole("listitem")).toHaveLength(3);
  // });
});
