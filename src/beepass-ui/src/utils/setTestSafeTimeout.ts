/**
 * Calls callback immediately in test environment.
 */
const setTestSafeTimeout = (callback: () => void, timeout: number) => {
  if (import.meta.env.NODE_ENV === "test") {
    callback();
  } else {
    setTimeout(() => callback(), timeout);
  }
};

export default setTestSafeTimeout;
