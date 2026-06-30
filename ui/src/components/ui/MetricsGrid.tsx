import React from 'react';
import { Stack } from '@mui/material';
import { MetricCard } from 'components/ui/MetricCard';

type MetricItem = {
  label: string;
  value: number | string;
  color?: string;
};

type MetricsGridProps = {
  items: MetricItem[];
  loading?: boolean;
};

export function MetricsGrid({ items, loading }: MetricsGridProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      useFlexGap
      flexWrap="wrap"
      sx={{ mb: 2 }}
    >
      {items.map((item) => (
        <MetricCard
          key={item.label}
          label={item.label}
          value={item.value}
          color={item.color}
          loading={loading}
        />
      ))}
    </Stack>
  );
}
