import { css } from "@emotion/react";

import ScrollableContent from "src/components/ScrollableContent";
import LicensesContent from "src/pages/LicensesPage/LicensesContent";

const licenseText = css`
  display: block;
  width: 100%;
  padding: 1.5rem;

  font-weight: 500;
  font-size: 0.7rem;
  line-height: 1.4;
  white-space: pre-line;
`;

const LicensesPage = () => {
  return (
    <ScrollableContent>
      <div dir="ltr" css={licenseText}>
        <LicensesContent />
      </div>
    </ScrollableContent>
  );
};

LicensesPage.displayName = "ServersPage";

export default LicensesPage;
