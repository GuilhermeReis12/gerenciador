import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as ThemeProviderMui } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ThemeProviderStyledComponents } from 'styled-components';
import { ThemeProvider as ThemeProviderEmotion } from '@emotion/react';
import axios from 'axios';
import { buildAppTheme, RemoteThemeColors } from 'styles/theme';

type AppThemeProviderProps = {
  children: ReactNode;
};

function buildLegacyTheme(remote?: RemoteThemeColors | null) {
  const tema = remote || {};
  return {
    color: {
      primary: {
        light: tema.primary_light,
        main: tema.primary_main,
        dark: tema.primary_dark,
        disabled: tema.primary_disabled
      }
    },
    logos: {
      logo_header: tema.logo_header
    }
  };
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const [remoteTheme, setRemoteTheme] = useState<RemoteThemeColors | null>(null);

  useEffect(() => {
    const fetchTema = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_HOST || 'http://localhost:8000'}/temas/`
        );
        setRemoteTheme(response?.data?.tema || null);
      } catch {
        setRemoteTheme(null);
      }
    };
    fetchTema();
  }, []);

  const muiTheme = useMemo(() => buildAppTheme(remoteTheme), [remoteTheme]);
  const legacyTheme = useMemo(() => buildLegacyTheme(remoteTheme), [remoteTheme]);

  return (
    <ThemeProviderEmotion theme={legacyTheme}>
      <ThemeProviderStyledComponents theme={legacyTheme}>
        <ThemeProviderMui theme={muiTheme}>
          <CssBaseline />
          {children}
        </ThemeProviderMui>
      </ThemeProviderStyledComponents>
    </ThemeProviderEmotion>
  );
}
