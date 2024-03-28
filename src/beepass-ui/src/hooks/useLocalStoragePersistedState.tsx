import { Dispatch, SetStateAction, useCallback, useState } from "react";

import {
  getLocalStorageValue,
  LocalStorageKey,
  LocalStorageValueType,
  localStorageValueTypeNames,
  setLocalStorageValue,
} from "src/utils/localStorage";

const useLocalStoragePersistedState = <Key extends LocalStorageKey>({
  initialVal,
  localStorageKey,
}: {
  initialVal: LocalStorageValueType[(typeof localStorageValueTypeNames)[Key]];
  localStorageKey: Key;
}): [
  LocalStorageValueType[(typeof localStorageValueTypeNames)[Key]],
  Dispatch<
    SetStateAction<
      LocalStorageValueType[(typeof localStorageValueTypeNames)[Key]]
    >
  >,
] => {
  const [state, setState] = useState(
    () => getLocalStorageValue({ key: localStorageKey }) ?? initialVal,
  );

  const setStateAndUpdateLocalStorage = useCallback(
    (
      state: LocalStorageValueType[(typeof localStorageValueTypeNames)[Key]],
    ) => {
      setState(state);
      setLocalStorageValue({ key: localStorageKey, value: state });
    },
    [localStorageKey],
  );

  return [state, setStateAndUpdateLocalStorage];
};

export default useLocalStoragePersistedState;
