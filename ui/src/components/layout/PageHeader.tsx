import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  gradient?: boolean;
};

export function PageHeader({ title, description, actions, gradient }: PageHeaderProps) {
  return (
    <Box
      sx={{
        mb: 3,
        ...(gradient
          ? {
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
              color: 'white'
            }
          : {})
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              color: gradient ? 'inherit' : 'text.primary'
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              sx={{
                mt: 0.5,
                color: gradient ? 'rgba(255,255,255,0.85)' : 'text.secondary',
                maxWidth: 720
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ flexShrink: 0 }}>{actions}</Box>}
      </Stack>
    </Box>
  );
}
