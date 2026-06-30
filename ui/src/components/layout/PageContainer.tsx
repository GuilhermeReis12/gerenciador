import React from 'react';
import { Box } from '@mui/material';
import { layoutTokens } from 'styles/theme';

type PageContainerProps = {
  children: React.ReactNode;
  maxWidth?: number;
};

export function PageContainer({ children, maxWidth = layoutTokens.contentMaxWidth }: PageContainerProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth,
        mx: 'auto',
        boxSizing: 'border-box',
        py: { xs: 2, md: 3 },
        px: { xs: 2, md: 3 }
      }}
    >
      {children}
    </Box>
  );
}
