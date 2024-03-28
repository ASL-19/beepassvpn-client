/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// React Router v6 doesn't have redirect component anymore,
// please check https://github.com/remix-run/react-router/blob/main/docs/upgrading/reach.md#redirect-redirectto-isredirect
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line react-memo/require-memo
const Redirect = ({ to }: { to: string }): any => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  });
  return null;
};

export default Redirect;
