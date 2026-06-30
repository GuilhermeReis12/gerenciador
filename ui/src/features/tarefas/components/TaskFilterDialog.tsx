import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack
} from '@mui/material';
import { TarefaPrioridade, TarefaStatus } from 'types/tarefas';
import {
  ARQUIVADA_FILTER_OPTIONS,
  ArquivadaFilter,
  ORDERING_OPTIONS,
  PRIORIDADE_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS
} from 'constants/tarefas';

export type TaskFilterState = {
  status: TarefaStatus | '';
  prioridade: TarefaPrioridade | '';
  arquivada: ArquivadaFilter;
  ordering: string;
};

type TaskFilterDialogProps = {
  open: boolean;
  draft: TaskFilterState;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
  onChange: (updater: (prev: TaskFilterState) => TaskFilterState) => void;
};

export function TaskFilterDialog({
  open,
  draft,
  onClose,
  onApply,
  onClear,
  onChange
}: TaskFilterDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Filtrar tarefas</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={draft.status}
              onChange={(e) => onChange((prev) => ({ ...prev, status: e.target.value as TarefaStatus | '' }))}
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Prioridade</InputLabel>
            <Select
              label="Prioridade"
              value={draft.prioridade}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, prioridade: e.target.value as TarefaPrioridade | '' }))
              }
            >
              {PRIORIDADE_FILTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Arquivamento</InputLabel>
            <Select
              label="Arquivamento"
              value={draft.arquivada}
              onChange={(e) => onChange((prev) => ({ ...prev, arquivada: e.target.value as ArquivadaFilter }))}
            >
              {ARQUIVADA_FILTER_OPTIONS.map((opt) => (
                <MenuItem key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Ordenação</InputLabel>
            <Select
              label="Ordenação"
              value={draft.ordering}
              onChange={(e) => onChange((prev) => ({ ...prev, ordering: e.target.value }))}
            >
              {ORDERING_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClear}>Limpar</Button>
        <Button variant="contained" onClick={onApply}>
          Aplicar filtros
        </Button>
      </DialogActions>
    </Dialog>
  );
}
