import { makeValidator } from "envalid";

/**
 * Validate that environment variable is a protocol and host.
 *
 * Valid examples:
 *
 * - "https://"
 *
 * Envalid custom validator (https://github.com/af/envalid#custom-validators)
 */
const protocolAndHost = makeValidator((s) => {
  if (/^https?:\/\/*/.test(s)) {
    return s;
  }

  throw new Error(
    'Must be a protocol and host with https (e.g. "https://beepassvpn.com" or "http://localhost:3000")',
  );
});

export default protocolAndHost;
