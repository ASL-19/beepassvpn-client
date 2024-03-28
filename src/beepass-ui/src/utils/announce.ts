/**
 * Trigger screen reader announcement using hidden `aria-live` regions.
 *
 * @see
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 *
 * @remarks
 * Based on:
 *
 * - https://a11y-guidelines.orange.com/en/web/components-examples/make-a-screen-reader-talk/
 * - https://github.com/adobe/react-spectrum/blob/main/packages/\@react-aria/live-announcer/src/LiveAnnouncer.tsx
 */
const announce = ({
  priority,
  text,
}: {
  priority: "assertive" | "polite";
  text: string;
}) => {
  if (typeof window === "undefined") {
    console.warn(
      "Tried to announce from server code — this shouldn't ever happen!",
    );

    return;
  }

  const containerId = `asl19-${priority}-announcements`;

  let containerElement = document.getElementById(containerId);

  if (!containerElement) {
    containerElement = document.createElement("div");
    containerElement.setAttribute("aria-live", priority);
    containerElement.setAttribute("id", containerId);
    containerElement.setAttribute("role", "log");

    containerElement.style.border = "0";
    containerElement.style.clip = "rect(0 0 0 0)";
    containerElement.style.height = "1px";
    containerElement.style.margin = "-1px";
    containerElement.style.overflow = "hidden";
    containerElement.style.padding = "0";
    containerElement.style.position = "absolute";
    containerElement.style.whiteSpace = "nowrap";
    containerElement.style.width = "1px";

    document.body.appendChild(containerElement);
  }

  const announcementElement = document.createElement("div");
  announcementElement.innerHTML = text;

  containerElement.appendChild(announcementElement);

  if (import.meta.env.NODE_ENV === "development") {
    console.info(`${priority} announcement: ${text}`);
  }

  window.setTimeout(function () {
    if (containerElement) {
      containerElement.removeChild(announcementElement);
    }
  }, 3000);
};

export default announce;
