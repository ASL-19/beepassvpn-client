import { FC, memo } from "react";

const formatTimeSegment = (time: number) => `${time < 10 ? "0" : ""}${time}`;

const ServerConnectionDuration: FC<{
  className?: string;
  connectionDuration: number;
}> = memo(({ connectionDuration }) => {
  const hours = Math.floor(connectionDuration / 3600);
  const mins = Math.floor((connectionDuration - hours * 3600) / 60);
  const seconds = Math.floor(connectionDuration % 60);

  const formattedHours = formatTimeSegment(hours);
  const formattedMins = formatTimeSegment(mins);
  const formattedSeconds = formatTimeSegment(seconds);

  return <>{`${formattedHours}:${formattedMins}:${formattedSeconds}`}</>;
});

ServerConnectionDuration.displayName = "ServerConnectionDuration";

export default ServerConnectionDuration;
