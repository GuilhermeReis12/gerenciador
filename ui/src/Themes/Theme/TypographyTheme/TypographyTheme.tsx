import React, { ReactNode } from 'react';
import {
  createTheme,
  ThemeProvider as MuiThemeProvider
} from '@mui/material/styles';

type DefaultThemeProps = {
  children: ReactNode;
};

//#region Modules
declare module '@mui/material/styles' {
  interface TypographyVariants {
    bodyLink: React.CSSProperties;
    bodyBold: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodyLight: React.CSSProperties;
    small: React.CSSProperties;
    smallBold: React.CSSProperties;
    smallLink: React.CSSProperties;
    smallLight: React.CSSProperties;
    captionMedium: React.CSSProperties;
    captionBold: React.CSSProperties;
    captionLight: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    bodyLink?: React.CSSProperties;
    bodyBold?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodyLight?: React.CSSProperties;
    small?: React.CSSProperties;
    smallBold?: React.CSSProperties;
    smallLink?: React.CSSProperties;
    smallLight?: React.CSSProperties;
    captionMedium?: React.CSSProperties;
    captionBold?: React.CSSProperties;
    captionLight?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    bodyLink: true;
    bodyBold: true;
    bodyMedium: true;
    bodyLight: true;
    small: true;
    smallBold: true;
    smallLink: true;
    smallLight: true;
    captionMedium: true;
    captionBold: true;
    captionLight: true;
  }
}
//#endregion

const typographyThemeSesi = createTheme({
  typography: {
    //#region H1/h2/h3/h4/h5/h6
    h1: {
      /* Heading/H1 */
      fontFamily: 'Inter',
      fontSize: '40px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'normal'
    },
    h2: {
      /* Heading/H2 */
      fontFamily: 'Inter',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'normal'
    },
    h3: {
      /* Heading/H3 */
      fontFamily: 'Inter',
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'normal'
    },
    h4: {
      /* Heading/H4 */
      fontFamily: 'Inter',
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'normal'
    },
    h5: {
      /* Heading/H5 */
      fontFamily: 'Inter',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: 'normal'
    },
    h6: {
      /* Heading/H6 */
      fontFamily: 'Inter',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: 'normal'
    },
    //#endregion

    //#region Body
    body1: {
      /* Desktop/Body/Body */
      fontFamily: 'Inter',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '24px' /* 150% */
    },
    bodyBold: {
      /* Desktop/Body/Body Bold */
      fontFamily: 'Inter',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '24px' /* 150% */
    },
    bodyMedium: {
      /* Body/Medium */
      fontFamily: 'Inter',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: 'normal'
    },
    bodyLight: {
      /* Body/Light */
      fontFamily: 'Inter',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 300,
      lineHeight: 'normal'
    },
    //#endregion

    //#region Small
    small: {
      /* Body/Small/Regular */
      fontFamily: 'Inter',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'normal'
    },
    smallBold: {
      /* Body/Small/Bold */
      fontFamily: 'Inter',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'normal'
    },
    smallLight: {
      /* Body/Small/Light */
      fontFamily: 'Inter',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 300,
      lineHeight: 'normal'
    },
    //#endregion

    //#region Caption
    caption: {
      /* Caption/Regular */
      fontFamily: 'Inter',
      fontSize: '12px',
      fontStyle: ' normal',
      fontWeight: 500,
      lineHeight: 'normal'
    },
    captionMedium: {
      /* Caption/Medium */
      fontFamily: 'Inter',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: 'normal'
    },
    captionBold: {
      /* Caption bold */
      fontFamily: 'Inter',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'normal'
    },
    captionLight: {
      /* Caption/Light */
      fontFamily: 'Inter',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 300,
      lineHeight: 'normal'
    }
    //#endregion
  }
});

const TypographyTheme = ({ children }: DefaultThemeProps) => {
  return (
    <MuiThemeProvider theme={typographyThemeSesi}>{children}</MuiThemeProvider>
  );
};

export default TypographyTheme;
