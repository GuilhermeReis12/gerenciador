import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { TarefaStatus, statusLabel } from 'types/tarefas';
import { STATUS_COLORS } from 'constants/tarefas';

type StatusChipProps = {
  status: TarefaStatus;
  size?: ChipProps['size'];
};

export function StatusChip({ status, size = 'small' }: StatusChipProps) {
  return (
    <Chip size={size} color={STATUS_COLORS[status]} label={statusLabel[status]} />
  );
}
