import React from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import {
  AssignableTeam,
  AssignableUser,
  AssignmentType,
  Tarefa,
  TarefaPrioridade,
  TarefaStatus
} from 'types/tarefas';

export type TaskFormState = {
  titulo: string;
  descricao: string;
  status: TarefaStatus;
  prioridade: TarefaPrioridade;
  data_limite: string;
  assignmentType: AssignmentType;
  assigned_to: number | '';
  assigned_team: number | '';
  link: string;
};

type TaskFormDialogProps = {
  open: boolean;
  editing: Tarefa | null;
  form: TaskFormState;
  formErrors: Record<string, string>;
  assignableUsers: AssignableUser[];
  assignableTeams: AssignableTeam[];
  onClose: () => void;
  onSave: () => void;
  onChange: (updater: (prev: TaskFormState) => TaskFormState) => void;
};

export function TaskFormDialog({
  open,
  editing,
  form,
  formErrors,
  assignableUsers,
  assignableTeams,
  onClose,
  onSave,
  onChange
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editing ? 'Editar tarefa' : 'Nova tarefa'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Título"
            value={form.titulo}
            onChange={(e) => onChange((s) => ({ ...s, titulo: e.target.value }))}
            fullWidth
            required
            error={!!formErrors.titulo}
            helperText={formErrors.titulo}
          />
          <TextField
            label="Descrição"
            value={form.descricao}
            onChange={(e) => onChange((s) => ({ ...s, descricao: e.target.value }))}
            fullWidth
            multiline
            minRows={3}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => onChange((s) => ({ ...s, status: e.target.value as TarefaStatus }))}
              >
                <MenuItem value="TODO">A fazer</MenuItem>
                <MenuItem value="IN_PROGRESS">Em andamento</MenuItem>
                <MenuItem value="DONE">Concluída</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Select
                label="Prioridade"
                value={form.prioridade}
                onChange={(e) => onChange((s) => ({ ...s, prioridade: e.target.value as TarefaPrioridade }))}
              >
                <MenuItem value="LOW">Baixa</MenuItem>
                <MenuItem value="MEDIUM">Média</MenuItem>
                <MenuItem value="HIGH">Alta</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <TextField
            label="Prazo"
            type="date"
            required
            InputLabelProps={{ shrink: true }}
            value={form.data_limite}
            onChange={(e) => onChange((s) => ({ ...s, data_limite: e.target.value }))}
            error={!!formErrors.data_limite}
            helperText={formErrors.data_limite || 'O prazo é obrigatório.'}
          />
          <TextField
            label="Link relacionado"
            value={form.link}
            onChange={(e) => onChange((s) => ({ ...s, link: e.target.value }))}
            placeholder="https://..."
            fullWidth
          />
          <Divider />
          <Typography sx={{ fontWeight: 700 }}>Atribuição operacional</Typography>
          <Alert severity="info">
            Atribua a um funcionário ou a uma equipe operacional. Grupos de permissão são apenas para controle de acesso.
          </Alert>
          <FormControl fullWidth>
            <InputLabel>Tipo de atribuição</InputLabel>
            <Select
              label="Tipo de atribuição"
              value={form.assignmentType}
              onChange={(e) =>
                onChange((s) => ({
                  ...s,
                  assignmentType: e.target.value as AssignmentType,
                  assigned_to: '',
                  assigned_team: ''
                }))
              }
            >
              <MenuItem value="user">Funcionário</MenuItem>
              <MenuItem value="team">Equipe operacional</MenuItem>
            </Select>
          </FormControl>
          {form.assignmentType === 'user' && (
            <FormControl fullWidth error={!!formErrors.assigned_to}>
              <InputLabel>Usuário responsável</InputLabel>
              <Select
                label="Usuário responsável"
                value={form.assigned_to}
                onChange={(e) =>
                  onChange((s) => ({
                    ...s,
                    assigned_to: e.target.value === '' ? '' : Number(e.target.value)
                  }))
                }
              >
                <MenuItem value="">
                  <em>Selecione um usuário</em>
                </MenuItem>
                {assignableUsers.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name || item.username} ({item.email})
                  </MenuItem>
                ))}
              </Select>
              {!!formErrors.assigned_to && <FormHelperText>{formErrors.assigned_to}</FormHelperText>}
            </FormControl>
          )}
          {form.assignmentType === 'team' && (
            <FormControl fullWidth error={!!formErrors.assigned_team}>
              <InputLabel>Equipe operacional</InputLabel>
              <Select
                label="Equipe operacional"
                value={form.assigned_team}
                onChange={(e) =>
                  onChange((s) => ({
                    ...s,
                    assigned_team: e.target.value === '' ? '' : Number(e.target.value)
                  }))
                }
              >
                <MenuItem value="">
                  <em>Selecione uma equipe</em>
                </MenuItem>
                {assignableTeams.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nome} ({item.membros_count || 0} membro(s))
                  </MenuItem>
                ))}
              </Select>
              {!!formErrors.assigned_team && <FormHelperText>{formErrors.assigned_team}</FormHelperText>}
              {!assignableTeams.length && (
                <FormHelperText>Cadastre equipes em Equipes Operacionais antes de atribuir.</FormHelperText>
              )}
            </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
