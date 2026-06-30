import React from 'react';
import { Card, CardContent } from '@mui/material';

type ContentCardProps = {
  children: React.ReactNode;
  noPadding?: boolean;
};

export function ContentCard({ children, noPadding }: ContentCardProps) {
  return (
    <Card>
      <CardContent sx={noPadding ? { p: 0, '&:last-child': { pb: 0 } } : undefined}>
        {children}
      </CardContent>
    </Card>
  );
}
