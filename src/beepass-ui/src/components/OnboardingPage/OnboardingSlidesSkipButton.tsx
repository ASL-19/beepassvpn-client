import { css } from "@emotion/react";
import { memo } from "react";
import { useSwiper } from "swiper/react";

import { useStrings } from "src/stores/appStore";
import colors from "src/style/colors";

export const skipButton = css({
  color: colors.lightGray,
  fontSize: "0.875rem",
  position: "absolute",
  right: "1.5rem",

  top: "2rem",
  zIndex: 200,
});

const OnboardingSlidesSkipButton = memo(() => {
  // Have to use swiper instance inside Swiper component
  const swiper = useSwiper();
  const strings = useStrings();

  const onSkipClick = () => {
    swiper.slideTo(4);
  };

  return (
    <button css={skipButton} onClick={onSkipClick}>
      {strings.OnboardingSlidesStep.onboardingSkip}
    </button>
  );
});

OnboardingSlidesSkipButton.displayName = "OnboardingSlidesSkipButton";

export default OnboardingSlidesSkipButton;
