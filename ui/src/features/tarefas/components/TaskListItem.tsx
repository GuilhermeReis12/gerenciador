import React from 'react';
import { Box, Checkbox, Chip, Stack, Typography } from '@mui/material';
import { Tarefa, prioridadeLabel, statusLabel } from 'types/tarefas';
import { StatusChip } from 'components/ui/StatusChip';
import { PriorityChip } from 'components/ui/PriorityChip';

type TaskListItemProps = {
  tarefa: Tarefa;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: number) => void;
  actions?: React.ReactNode;
};

export function TaskListItem({
  tarefa,
  selectable,
  selected,
  onToggleSelect,
  actions
}: TaskListItemProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)' }
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
        {selectable && onToggleSelect && (
          <Checkbox checked={selected} onChange={() => onToggleSelect(tarefa.id)} />
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 700 }} noWrap>
            {tarefa.titulo}
          </Typography>
          <Stack direction="row" spacing={0.8} sx={{ mt: 0.5 }} flexWrap="wrap" useFlexGap>
            <StatusChip status={tarefa.status} />
            <PriorityChip prioridade={tarefa.prioridade} />
            {!!tarefa.data_limite && (
              <Chip size="small" variant="outlined" label={`Prazo ${tarefa.data_limite}`} />
            )}
            {tarefa.is_assigned_to_me && <Chip size="small" color="info" label="Atribuída a mim" />}
            {!!tarefa.assigned_to_name && (
              <Chip size="small" variant="outlined" label={`Usuário: ${tarefa.assigned_to_name}`} />
            )}
            {!!tarefa.assigned_team_name && (
              <Chip size="small" variant="outlined" label={`Equipe: ${tarefa.assigned_team_name}`} />
            )}
            {!!tarefa.link && (
              <Chip
                size="small"
                variant="outlined"
                label="Abrir link"
                component="a"
                clickable
                href={tarefa.link}
                target="_blank"
                rel="noreferrer"
              />
            )}
            {!!tarefa.created_by_name && (
              <Chip size="small" variant="outlined" label={`Criada por ${tarefa.created_by_name}`} />
            )}
            {tarefa.arquivada && <Chip size="small" color="warning" label="Arquivada" />}
          </Stack>
        </Box>
      </Stack>
      {actions && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={0.8} sx={{ flexShrink: 0 }}>
          {actions}
        </Stack>
      )}
    </Box>
  );
}

// Re-export labels for convenience in feature consumers
export { statusLabel, prioridadeLabel };
