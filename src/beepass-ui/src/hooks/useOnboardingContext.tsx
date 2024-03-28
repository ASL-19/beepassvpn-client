import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

import useLocalStoragePersistedState from "src/hooks/useLocalStoragePersistedState";
import { getLocalStorageValue } from "src/utils/localStorage";

export type OnboardingProviderContextProps = {
  isLanguageSet: boolean;
  onboardingCompleted: boolean;
  setIsLanguageSet?: Dispatch<SetStateAction<boolean>>;
  setOnboardingCompleted?: Dispatch<SetStateAction<boolean>>;
};

const OnboardingContext = createContext<OnboardingProviderContextProps>({
  isLanguageSet: false,
  onboardingCompleted: false,
});

const OnboardingProvider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: OnboardingProviderContextProps;
}) => {
  const [isLanguageSet, setIsLanguageSet] = useState(
    getLocalStorageValue({ key: "language" }) ? true : false,
  );

  const [onboardingCompleted, setOnboardingCompleted] =
    useLocalStoragePersistedState({
      initialVal: false,
      localStorageKey: "onboardingCompleted",
    });

  const defaultContext: OnboardingProviderContextProps = {
    isLanguageSet,
    onboardingCompleted,
    setIsLanguageSet,
    setOnboardingCompleted,
  };

  return (
    <OnboardingContext.Provider value={initialState ?? defaultContext}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => useContext(OnboardingContext);

export default OnboardingProvider;
