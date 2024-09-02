import { ButtonProps } from "./Button.types";
import * as Styled from "./ButtonStyled";

const Button = ({
  variant = "primary",
  children,
  color = "textColorWhite",
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  clicked,
  fullfullWidth = false,
  ...props
}: ButtonProps) => {

  return (
    <>
      <Styled.ButtonStyled
        color={color}
        disabled={disabled}
        onClick={onClick}
        fullfullWidth={fullfullWidth}
        variant={variant}
        {...props}
      >
        {leftIcon && (leftIcon)}
        {children}
        {rightIcon && (rightIcon)}
      </Styled.ButtonStyled>
    </>
  );
};

export default Button;
