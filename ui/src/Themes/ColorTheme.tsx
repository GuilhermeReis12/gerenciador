import { ReactNode, useEffect, useState } from 'react';
import {
  createTheme as createThemeMui,
  ThemeProvider as ThemeProviderMui
} from '@mui/material/styles';
import { ThemeProvider as ThemeProviderStyledComponents } from 'styled-components';
import { ThemeProvider as ThemeProviderEmotion } from '@emotion/react';
import axios from 'axios';

type DefaultThemeProps = {
  children: ReactNode;
};

const DefaultColorTheme = ({ children }: DefaultThemeProps) => {
  const [tema, setTema] = useState<any>();

  const fetchTema = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_HOST || 'http://localhost:8000'}/temas/`
      );
      setTema(response?.data?.tema);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!tema) {
      fetchTema();
    }
  }, []);
  //#region Theme MUI
  const colorTheme = createThemeMui({
    color: {
      primary: {
        light: tema?.primary_light,
        main: tema?.primary_main,
        dark: tema?.primary_dark,
        disabled: tema?.primary_disabled
      },
      secondary: {
        lightest: tema?.secondary_lightest,
        lightest2: tema?.secondary_lightest2,
        medium: tema?.secondary_medium,
        lighter: tema?.secondary_lighter,
        greenAlt: tema?.secondary_greenAlt
      },
      indicatorColor: {
        ei: tema?.indicatorColor_ei,
        ef1: tema?.indicatorColor_ef1,
        ef2: tema?.indicatorColor_ef2,
        em: tema?.indicatorColor_em,
        eja: tema?.indicatorColor_eja
      },
      feedbackColor: {
        informative: tema?.feedbackColor_informative,
        warning: tema?.feedbackColor_warning,
        error: tema?.feedbackColor_error,
        sucess: tema?.feedbackColor_sucess
      },
      textColor: {
        black: tema?.textColor_black,
        darkest: tema?.textColor_darkest,
        dark: tema?.textColor_dark,
        light: tema?.textColor_light,
        lighter: tema?.textColor_lighter,
        white: tema?.textColor_white
      }
    },
    logos: {
      logo_header: tema?.logo_header
    }
  });
  //#endregion

  //#region Theme Styled Components
  const colorThemeStyledComponents = {
    color: {
      primary: {
        light: tema?.primary_light,
        main: tema?.primary_main,
        dark: tema?.primary_dark,
        disabled: tema?.primary_disabled
      },
      secondary: {
        lightest: tema?.secondary_lightest,
        lightest2: tema?.secondary_lightest2,
        medium: tema?.secondary_medium,
        lighter: tema?.secondary_lighter,
        greenAlt: tema?.secondary_greenAlt
      },
      indicatorColor: {
        ei: tema?.indicatorColor_ei,
        ef1: tema?.indicatorColor_ef1,
        ef2: tema?.indicatorColor_ef2,
        em: tema?.indicatorColor_em,
        eja: tema?.indicatorColor_eja
      },
      feedbackColor: {
        informative: tema?.feedbackColor_informative,
        warning: tema?.feedbackColor_warning,
        error: tema?.feedbackColor_error,
        sucess: tema?.feedbackColor_sucess
      },
      textColor: {
        black: tema?.textColor_black,
        darkest: tema?.textColor_darkest,
        dark: tema?.textColor_dark,
        light: tema?.textColor_light,
        lighter: tema?.textColor_lighter,
        white: tema?.textColor_white
      }
    },
    logos: {
      logo_header: tema?.logo_header
    }
  };

  const ColorProviderEmotion = {
    color: {
      primary: {
        light: tema?.primary_light,
        main: tema?.primary_main,
        dark: tema?.primary_dark,
        disabled: tema?.primary_disabled
      },
      secondary: {
        lightest: tema?.secondary_lightest,
        lightest2: tema?.secondary_lightest2,
        medium: tema?.secondary_medium,
        lighter: tema?.secondary_lighter,
        greenAlt: tema?.secondary_greenAlt
      },
      indicatorColor: {
        ei: tema?.indicatorColor_ei,
        ef1: tema?.indicatorColor_ef1,
        ef2: tema?.indicatorColor_ef2,
        em: tema?.indicatorColor_em,
        eja: tema?.indicatorColor_eja
      },
      feedbackColor: {
        informative: tema?.feedbackColor_informative,
        warning: tema?.feedbackColor_warning,
        error: tema?.feedbackColor_error,
        sucess: tema?.feedbackColor_sucess
      },
      textColor: {
        black: tema?.textColor_black,
        darkest: tema?.textColor_darkest,
        dark: tema?.textColor_dark,
        light: tema?.textColor_light,
        lighter: tema?.textColor_lighter,
        white: tema?.textColor_white
      }
    },
    logos: {
      logo_header: tema?.logo_header
    }
  };
  //#endregion

  return (
    <ThemeProviderEmotion theme={ColorProviderEmotion}>
      <ThemeProviderStyledComponents theme={colorThemeStyledComponents}>
        <ThemeProviderMui theme={colorTheme}>{children}</ThemeProviderMui>
      </ThemeProviderStyledComponents>
    </ThemeProviderEmotion>
  );
};
export default DefaultColorTheme;
