import { Event } from "@sentry/electron";

/**
 * Filter sensitive data from Sentry reports.
 */
export const sentryBeforeSend = (event: Event) => {
  // -------------------
  // --- Device name ---
  // -------------------
  // This can contain the user’s real name (e.g. "Grant’s phone")

  if (event.contexts?.device?.name) {
    // eslint-disable-next-line no-param-reassign
    delete event.contexts.device.name;
  }

  // ------------------
  // --- IP address ---
  // ------------------
  if (event.user?.ip_address) {
    // eslint-disable-next-line no-param-reassign
    delete event.user.ip_address;
  }

  return event;
};
