import React from 'react';
import { Pagination, Stack, Typography } from '@mui/material';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { PAGE_SIZE_OPTIONS } from 'constants/pagination';

type DataPaginationProps = {
  page: number;
  totalPages: number;
  count: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
};

export function DataPagination({
  page,
  totalPages,
  count,
  pageSize,
  onPageChange,
  onPageSizeChange,
  showPageSize = false
}: DataPaginationProps) {
  if (totalPages <= 1 && !showPageSize) return null;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}
    >
      <Typography variant="body2" color="text.secondary">
        {totalPages > 1
          ? `Página ${page} de ${totalPages} — ${count} registro(s)`
          : `${count} registro(s)`}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        {showPageSize && onPageSizeChange && pageSize && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Por página</InputLabel>
            <Select
              label="Por página"
              value={String(pageSize)}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <MenuItem key={size} value={String(size)}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {totalPages > 1 && (
          <Pagination
            page={page}
            count={totalPages}
            onChange={(_, value) => onPageChange(value)}
            color="primary"
            shape="rounded"
          />
        )}
      </Stack>
    </Stack>
  );
}
