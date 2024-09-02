import { FC } from "react";
import { BaseIcon, IconProps } from "./IconContainer/BoxIcon";

export const CalendarIcon: FC<IconProps> = props => (
  <BaseIcon {...props}>
    <image href="https://educat-design-system.s3.sa-east-1.amazonaws.com/calendar.svg" />
  </BaseIcon>
);
