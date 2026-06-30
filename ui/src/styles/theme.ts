import { createTheme, ThemeOptions } from '@mui/material/styles';

export type RemoteThemeColors = {
  primary_light?: string;
  primary_main?: string;
  primary_dark?: string;
  primary_disabled?: string;
  logo_header?: string;
};

const defaultPalette = {
  primary: {
    light: '#60a5fa',
    main: '#2563eb',
    dark: '#1d4ed8',
    contrastText: '#ffffff'
  },
  secondary: {
    light: '#94a3b8',
    main: '#64748b',
    dark: '#475569',
    contrastText: '#ffffff'
  },
  success: { main: '#16a34a' },
  warning: { main: '#d97706' },
  error: { main: '#dc2626' },
  info: { main: '#0284c7' },
  background: {
    default: '#f1f5f9',
    paper: '#ffffff'
  },
  text: {
    primary: '#0f172a',
    secondary: '#64748b'
  },
  divider: '#e2e8f0'
};

export function buildAppTheme(remote?: RemoteThemeColors | null) {
  const primaryMain = remote?.primary_main || defaultPalette.primary.main;
  const primaryLight = remote?.primary_light || defaultPalette.primary.light;
  const primaryDark = remote?.primary_dark || defaultPalette.primary.dark;

  const options: ThemeOptions = {
    palette: {
      ...defaultPalette,
      primary: {
        light: primaryLight,
        main: primaryMain,
        dark: primaryDark,
        contrastText: '#ffffff'
      }
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      button: { textTransform: 'none', fontWeight: 600 }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: defaultPalette.background.default
          }
        }
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, padding: '8px 16px' }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 12 }
        }
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 500 }
        }
      },
      MuiTextField: {
        defaultProps: { size: 'small' }
      },
      MuiFormControl: {
        defaultProps: { size: 'small' }
      }
    }
  };

  return createTheme(options);
}

export const layoutTokens = {
  sidebarWidth: 260,
  sidebarCollapsedWidth: 72,
  topBarHeight: 64,
  contentMaxWidth: 1400
};
