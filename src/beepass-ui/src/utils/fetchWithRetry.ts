export const fetchWithRetry = (
  url: string,
  options = {},
  retries = 5,
  interval = 2000,
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    const fetchRequest = () => {
      fetch(url, options)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
          }
          resolve(response);
        })
        .catch((error) => {
          if (retries === 0) {
            reject(error);
          } else {
            setTimeout(() => {
              fetchRequest();
            }, interval);
            // eslint-disable-next-line no-param-reassign
            retries--;
          }
        });
    };
    fetchRequest();
  });
};
