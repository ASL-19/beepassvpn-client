import { FC, memo } from "react";

import OnboardingLanguageStep from "../components/OnboardingPage/OnboardingLanguageStep";
import OnboardingSlidesStep from "../components/OnboardingPage/OnboardingSlidesStep";

import { useOnboardingContext } from "src/hooks/useOnboardingContext";

const OnboardingPage: FC = memo(() => {
  const { isLanguageSet } = useOnboardingContext();

  return !isLanguageSet ? <OnboardingLanguageStep /> : <OnboardingSlidesStep />;
});

OnboardingPage.displayName = "OnboardingPage";

export default OnboardingPage;
