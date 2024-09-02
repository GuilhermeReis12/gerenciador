import React, { useContext, useState } from 'react';
import { MenuItemStyled } from './MenuStyled';
import { ThemeContext, useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ThemeColorType {
  ThemeColor?:
    | 'main'
    | 'dark'
    | 'light'
    | 'disabled'
    | 'medium'
    | 'lighter'
    | 'lightest'
    | 'lightest2'
    | 'greenAlt'
    | 'ei'
    | 'ef1'
    | 'ef2'
    | 'em'
    | 'eja'
    | 'informative'
    | 'warning'
    | 'error'
    | 'sucess'
    | 'textColorBlack'
    | 'textColorDarkest'
    | 'textColorDark'
    | 'textColorLight'
    | 'textColorLighter'
    | 'textColorWhite'
    | React.CSSProperties['color'];
}

export interface MenuItemProps {
  title?: string;
  color?: ThemeColorType['ThemeColor'];
  children?: React.ReactNode;
  titleFont?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'bodyMedium'
    | 'bodyBold'
    | 'bodyLight'
    | 'small'
    | 'smallLight'
    | 'smallBold'
    | 'caption'
    | 'captionMedium'
    | 'captionBold'
    | 'captionLight';
  dropdown?: boolean;
  onClick?: () => void;
}

const MenuItem = ({
  title = 'Menu Item',
  titleFont = 'bodyMedium',
  color = 'dark',
  dropdown = false,
  onClick,
  children
}: MenuItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // const colors = () => {
  // 	switch (color) {
  // 		case "main":
  // 			return theme.color?.primary.main || themes?.color.primary.main;
  // 		case "dark":
  // 			return theme.color?.primary.dark || themes?.color.primary.dark;
  // 		case "light":
  // 			return theme.color?.primary.light || themes?.color.primary.light;
  // 		case "disabled":
  // 			return theme.color?.primary.disabled || themes?.color.primary.disabled;
  // 		case "medium":
  // 			return theme.color?.secondary.medium || themes?.color.secondary.medium;
  // 		case "lighter":
  // 			return theme.color?.secondary.lighter || themes?.color.secondary.lighter;
  // 		case "lightest":
  // 			return theme.color?.secondary.lightest || themes?.color.secondary.lightest;
  // 		case "lightest2":
  // 			return theme.color?.secondary.lightest2 || themes?.color.secondary.lightest2;
  // 		case "greenAlt":
  // 			return theme.color?.secondary.greenAlt || themes?.color.secondary.greenAlt;
  // 		case "ei":
  // 			return theme.color?.indicatorColor.ei || themes?.color.indicatorColor.ei;
  // 		case "ef1":
  // 			return theme.color?.indicatorColor.ef1 || themes?.color.indicatorColor.ef1;
  // 		case "ef2":
  // 			return theme.color?.indicatorColor.ef2 || themes?.color.indicatorColor.ef2;
  // 		case "em":
  // 			return theme.color?.indicatorColor.em || themes?.color.indicatorColor.em;
  // 		case "eja":
  // 			return theme.color?.indicatorColor.eja || themes?.color.indicatorColor.eja;
  // 		case "informative":
  // 			return theme.color?.feedbackColor.informative || themes?.color.feedbackColor.informative;
  // 		case "warning":
  // 			return theme.color?.feedbackColor.warning || themes?.color.feedbackColor.warning;
  // 		case "error":
  // 			return theme.color?.feedbackColor.error || themes?.color.feedbackColor.error;
  // 		case "sucess":
  // 			return theme.color?.feedbackColor.sucess || themes?.color.feedbackColor.sucess;
  // 		case "textColorBlack":
  // 			return theme.color?.textColor.black || themes?.color.textColor.black;
  // 		case "textColorDarkest":
  // 			return theme.color?.textColor.darkest || themes?.color.textColor.darkest;
  // 		case "textColorDark":
  // 			return theme.color?.textColor.dark || themes?.color.textColor.dark;
  // 		case "textColorLight":
  // 			return theme.color?.textColor.light || themes?.color.textColor.light;
  // 		case "textColorLighter":
  // 			return theme.color?.textColor.lighter || themes?.color.textColor.lighter;
  // 		case "textColorWhite":
  // 			return theme.color?.textColor.white || themes?.color.textColor.white;
  // 		default:
  // 			return color;
  // 	};
  // };

  const handleItemClick = () => {
    if (dropdown) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <>
      {dropdown ? (
        <MenuItemStyled
          color={'#4759FF'}
          onClick={dropdown ? handleItemClick : onClick}
        >
          <span>{title}</span>
          <FontAwesomeIcon
            icon={isExpanded ? 'chevron-down' : 'chevron-up'}
            style={{ marginLeft: '0.5rem' }}
          />
          {isExpanded && children}
        </MenuItemStyled>
      ) : (
        <MenuItemStyled onClick={onClick} color={'#4759FF'}>
          <span>{title}</span>
        </MenuItemStyled>
      )}
    </>
  );
};

export default MenuItem;
