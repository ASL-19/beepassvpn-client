import { css, Global } from "@emotion/react";
import {
  ComponentProps,
  FC,
  memo,
  useCallback,
  useMemo,
  useState,
} from "react";
import { A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { container as chooseLanguagePageContainer } from "./OnboardingLanguageStep";

import OnboardingSlidesSkipButton from "src/components/OnboardingPage/OnboardingSlidesSkipButton";
import DataCollectionButtonGroup from "src/components/PermissionDialog/DataCollectionButtonGroup";
import PermissionDialog, {
  PermissionDialogContentStrings,
} from "src/components/PermissionDialog/PermissionDialog";
import { useOnboardingContext } from "src/hooks/useOnboardingContext";
import onBoardingEnFourPng from "src/static/onboarding/onBoardingEnFour.png";
import onBoardingEnOnePng from "src/static/onboarding/onBoardingEnOne.png";
import onBoardingEnThreeOng from "src/static/onboarding/onBoardingEnThree.png";
import onBoardingEnPng from "src/static/onboarding/onBoardingEnTwo.png";
import onBoardingFaFourPng from "src/static/onboarding/onBoardingFaFour.png";
import onBoardingFaOnePng from "src/static/onboarding/onBoardingFaOne.png";
import onBoardingFaThreePng from "src/static/onboarding/onBoardingFaThree.png";
import onBoardingFaTwoPng from "src/static/onboarding/onBoardingFaTwo.png";
import { useLocaleCode, useStrings } from "src/stores/appStore";
import { invisible } from "src/style/generalStyles";
import swiperStyles from "src/style/swiperStyles";

export type OnboardingSlidesStepString = {
  dataCollectionPermissionDialogContent: PermissionDialogContentStrings;
  onboardingSkip: string;
  onboardingSlide1Alt: string;
  onboardingSlide2Alt: string;
  onboardingSlide3Alt: string;
  onboardingSlide4Alt: string;
};

const onBoardingPageContainer = css(chooseLanguagePageContainer, {
  "& .swiper": {
    height: "100%",
    minHeight: "15.625rem",
    width: "100%",
  },
  "& .swiper-pagination-bullet": {
    height: "1rem",
    width: "1rem",
  },
  "& .swiper-pagination-bullets": {
    bottom: "1.25rem",
  },
  "& .swiper-slide": {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
});

const slideImage = css({
  height: "100%",
  maxWidth: "90%",
  objectFit: "contain",
});

const lastSliderImage = css(slideImage, {
  cursor: "pointer",
  position: "absolute",
  top: "-2rem",
});

const OnboardingSlidesStep: FC = memo(() => {
  const localeCode = useLocaleCode();
  const isEn = localeCode === "en";
  const strings = useStrings();
  const { setOnboardingCompleted } = useOnboardingContext();

  const [dataCollectionDialogIsOpen, setDataCollectionDialogIsOpen] =
    useState(false);

  const [skipButtonIsVisible, setSkipButtonIsVisible] = useState(true);

  const closeDataCollectionDialog = useCallback(
    () => setDataCollectionDialogIsOpen(false),
    [],
  );

  const openDataCollectionDialog = useCallback(
    () => setDataCollectionDialogIsOpen(true),
    [],
  );

  const onConfirmButtonClick = useCallback(() => {
    setDataCollectionDialogIsOpen(false);
    setOnboardingCompleted(true);
  }, [setOnboardingCompleted]);

  const swiperSlides = useMemo(
    () => [
      <SwiperSlide key="0">
        <img
          src={isEn ? onBoardingEnOnePng : onBoardingFaOnePng}
          alt={strings.OnboardingSlidesStep.onboardingSlide1Alt}
          width="auto"
          height="auto"
          css={slideImage}
        />
      </SwiperSlide>,
      <SwiperSlide key="1">
        <img
          src={isEn ? onBoardingEnPng : onBoardingFaTwoPng}
          alt={strings.OnboardingSlidesStep.onboardingSlide2Alt}
          width="auto"
          height="auto"
          css={slideImage}
        />
      </SwiperSlide>,
      <SwiperSlide key="2">
        <img
          src={isEn ? onBoardingEnThreeOng : onBoardingFaThreePng}
          alt={strings.OnboardingSlidesStep.onboardingSlide3Alt}
          width="auto"
          height="auto"
          css={slideImage}
        />
      </SwiperSlide>,
      <SwiperSlide onClick={openDataCollectionDialog} key="3">
        <img
          src={isEn ? onBoardingEnFourPng : onBoardingFaFourPng}
          alt={strings.OnboardingSlidesStep.onboardingSlide4Alt}
          width="auto"
          height="auto"
          css={lastSliderImage}
        />
      </SwiperSlide>,
    ],
    [isEn, openDataCollectionDialog, strings],
  );

  const onSwiperSlideChange = useCallback<
    ComponentProps<typeof Swiper>["onSlideChange"]
  >(
    (swiper) => {
      setSkipButtonIsVisible(swiper.activeIndex < swiperSlides.length - 1);
    },
    [swiperSlides.length],
  );

  return (
    <div css={onBoardingPageContainer}>
      <Global styles={swiperStyles} />

      <Swiper
        pagination={true}
        modules={[Pagination, A11y]}
        onSlideChange={onSwiperSlideChange}
      >
        {skipButtonIsVisible && <OnboardingSlidesSkipButton />}

        {swiperSlides}
      </Swiper>
      {/* This is for screen reader users to click after going through the slides */}
      <button css={invisible} onClick={openDataCollectionDialog}>
        Start using BeePass
      </button>
      <PermissionDialog
        close={closeDataCollectionDialog}
        isOpen={dataCollectionDialogIsOpen}
        permissionDialogContentStrings={
          strings.OnboardingSlidesStep.dataCollectionPermissionDialogContent
        }
        onConfirmButtonClick={onConfirmButtonClick}
        ButtonGroup={DataCollectionButtonGroup}
      />
    </div>
  );
});

OnboardingSlidesStep.displayName = "OnboardingSlidesStep";

export default OnboardingSlidesStep;
