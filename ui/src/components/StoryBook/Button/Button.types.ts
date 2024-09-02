import { ReactNode } from "react";
import ThemeColorType from "../../../Themes/ThemeTypes";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  clicked?: boolean;
  color?: ThemeColorType["ThemeColor"];
  disabled?: boolean;
  onClick?: () => void;
  variant?: "primary" | "alternative" | "outlined" | "loading" | "page" | "icon";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullfullWidth?: boolean;
};


export type ButtonPropsTypes = ButtonProps;
