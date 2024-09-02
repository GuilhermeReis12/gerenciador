import styled from "@emotion/styled";
import { ButtonProps } from "./Button.types";


export const ButtonStyled = styled("button") <ButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props) => (props.fullfullWidth ? ("100%") : (getWidth(props)))};
  height: ${(props) => (props.variant === "page" || "icon" ? (getWidth(props)) : (""))};
  padding: ${(props) => (getPadding(props))};

  border: ${(props) => (getBorder(props))};
  
  cursor: pointer;
  border-radius: ${(props) => (getBorderRadius(props))};
  gap: 0.5rem;

  color: ${(props) => (getColorFont(props))};
  background: ${(props) => (getBackground(props))};

  &:hover {
    background: ${(props) => (getHoverBackground(props))};
    border-color: ${(props) => (getHoverBorderColor(props))};
    color: ${(props) => (getColorFontHover(props))};
  };

  &:disabled {
    background: ${(props) => (getDisabledBackground(props))};
    border-color: ${(props) => (getDisabledBorderColor(props))};
    color: ${(props) => (getColorDisabled(props))};
    cursor: default;
  };

  &:not(:disabled):active {
    background: ${(props) => (getActiveBackground(props))};
    border: ${(props) => (getActiveBorder(props))};
    color: ${(props) => (getColorActive(props))};
  };

  &:focus {
    outline: 2px solid #F673AD;
  };
`;

function getWidth(props: any) {
  switch (props.variant) {
    case "page": {
      return (
        "32px"
      );
    };
    case "icon": {
      return (
        "30px"
      );
    };
    default: {
      return (
        ""
      );
    };
  };
};

function getColorFont(props: any) {
  switch (props.variant) {
    case "primary": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "icon": {
      return (
        ""
      );
    };
    default: {
      return (
        props.theme.color.primary.main
      );
    };
  };
};

function getBorder(props: any) {
  switch (props.variant) {
    case "outlined": {
      return (
        `2px solid ${props.theme.color.primary.main}`
      );
    };
    case "alternative": {
      return (
        "none"
      );
    };
    case "icon": {
      return (
        "none"
      );
    };
    case "page": {
      return (
        "none"
      );
    };
    default: {
      return (
        `1.5px solid ${props.theme.color.primary.main}`
      );
    };
  };
};

function getBorderRadius(props: any) {
  switch (props.variant) {
    case "loading": {
      return (
        "0.5rem"
      );
    };
    case "icon": {
      return (
        "0.25rem"
      );
    };
    case "page": {
      return (
        "1.5rem"
      );
    };
    case "alternative": {
      return (
        ""
      );
    };
    default: {
      return (
        "0.5rem"
      );
    };
  };
};

function getBackground(props: any) {
  switch (props.variant) {
    case "outlined": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "loading": {
      return (
        props.theme.color.secondary.lightest2
      );
    };
    case "alternative": {
      return (
        "transparent"
      );
    };
    case "icon": {
      return (
        "transparent"
      );
    };
    case "page": {
      return (
        "transparent"
      );
    };
    default: {
      return (
        props.theme.color.primary.main
      );
    };
  };
};

function getPadding(props: any) {
  switch (props.variant) {
    case "loading": {
      return (
        "0.75rem 5.69rem"
      );
    };
    case "page": {
      return (
        "0.5rem"
      );
    };
    case "alternative": {
      return (
        "2px"
      );
    };
    default: {
      return (
        "0.75rem 1rem"
      );
    };
  };
}

//#region Hover
function getColorFontHover(props: any) {
  switch (props.variant) {
    case "primary": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "loading": {
      return (
        props.theme.color.primary.dark
      );
    };
    case "page": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "icon": {
      return (
        props.theme.color.textColor.white
      );
    };
    default: {
      return (
        props.theme.color.secondary.medium
      );
    };
  };
};

function getHoverBorderColor(props: any) {
  switch (props.variant) {
    case "alternative": {
      return (
        "none"
      );
    };
    case "icon": {
      return (
        props.theme.color.primary.main
      );
    };
    default: {
      return (
        props.theme.color.secondary.medium
      );
    };
  };
};

function getHoverBackground(props: any) {
  switch (props.variant) {
    case "outlined": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "alternative": {
      return (
        "transparent"
      );
    };
    case "loading": {
      return (
        props.theme.color.secondary.lightest
      );
    };
    case "icon": {
      return (
        props.theme.color.primary.main
      );
    };
    case "page": {
      return (
        props.theme.color.primary.main
      );
    };
    default: {
      return (
        props.theme.color.secondary.medium
      );
    };
  };
};
//#endregion

//#region Disabled
function getColorDisabled(props: any) {
  switch (props.variant) {
    case "primary": {
      return (
        props.theme.color.textColor.white
      );
    };
    default: {
      return (
        props.theme.color.primary.disabled
      );
    };
  };
};

function getDisabledBackground(props: any) {
  switch (props.variant) {
    case "outlined": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "alternative" || "icon": {
      return (
        "transparent"
      );
    };
    default: {
      return (
        props.theme.color.primary.disabled
      );
    };
  };
};

function getDisabledBorderColor(props: any) {
  return (props.variant === "alternative" ? (
    "none"
  ) : (
    props.theme.color.primary.disabled
  )
  );
};
//#endregion

//#region Active
function getColorActive(props: any) {
  switch (props.variant) {
    case "primary": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "page": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "icon": {
      return (
        props.theme.color.textColor.white
      );
    };
    default: {
      return (
        props.theme.color.primary.dark
      );
    };
  };
};

function getActiveBackground(props: any) {
  switch (props.variant) {
    case "outlined": {
      return (
        props.theme.color.textColor.white
      );
    };
    case "alternative": {
      return (
        "transparent"
      );
    };
    case "icon": {
      return (
        "transparent"
      );
    };
    case "page": {
      return (
        props.theme.color.primary.main
      );
    };
    case "loading": {
      return (
        props.theme.color.secondary.lightest2
      );
    };
    default: {
      return (
        props.theme.color.primary.dark
      );
    };
  };
};

function getActiveBorder(props: any) {
  switch (props.variant) {
    case "outlined": {
      return (
        `2px solid ${props.theme.color.primary.dark}`
      );
    };
    case "alternative": {
      return (
        "none"
      );
    };
    case "icon": {
      return (
        "none"
      );
    };
    default: {
      return (
        `1.5px solid ${props.theme.color.primary.dark}`
      );
    };
  };
};
//#endregion
