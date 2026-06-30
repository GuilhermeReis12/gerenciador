import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { TarefaPrioridade, prioridadeLabel } from 'types/tarefas';

type PriorityChipProps = {
  prioridade: TarefaPrioridade;
  size?: ChipProps['size'];
};

export function PriorityChip({ prioridade, size = 'small' }: PriorityChipProps) {
  const color =
    prioridade === 'HIGH' ? 'error' : prioridade === 'MEDIUM' ? 'warning' : 'default';

  return (
    <Chip
      size={size}
      variant="outlined"
      color={color}
      label={prioridadeLabel[prioridade]}
    />
  );
}
