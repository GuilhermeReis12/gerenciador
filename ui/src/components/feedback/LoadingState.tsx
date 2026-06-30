import React from 'react';
import { Box, LinearProgress, Skeleton, Stack } from '@mui/material';

type LoadingStateProps = {
  variant?: 'linear' | 'skeleton';
  rows?: number;
  height?: number;
};

export function LoadingState({ variant = 'skeleton', rows = 3, height = 68 }: LoadingStateProps) {
  if (variant === 'linear') {
    return (
      <Box sx={{ py: 1 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={height} />
      ))}
    </Stack>
  );
}
