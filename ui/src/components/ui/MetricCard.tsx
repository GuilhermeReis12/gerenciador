import React from 'react';
import { Card, CardContent, Skeleton, Typography } from '@mui/material';

type MetricCardProps = {
  label: string;
  value: number | string;
  color?: string;
  loading?: boolean;
};

export function MetricCard({ label, value, color, loading }: MetricCardProps) {
  return (
    <Card sx={{ flex: '1 1 140px', minWidth: 140 }}>
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography variant="caption" color="text.secondary" display="block">
          {label}
        </Typography>
        {loading ? (
          <Skeleton width={48} height={32} />
        ) : (
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: color || 'text.primary', lineHeight: 1.2 }}
          >
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
