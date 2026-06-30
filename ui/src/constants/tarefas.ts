import { TarefaPrioridade, TarefaStatus } from 'types/tarefas';

export type ArquivadaFilter = 'true' | 'false' | '';

export const STATUS_COLORS: Record<
  TarefaStatus,
  'default' | 'warning' | 'success' | 'info'
> = {
  TODO: 'default',
  IN_PROGRESS: 'info',
  DONE: 'success'
};

export const ORDERING_OPTIONS = [
  { value: '-created_at', label: 'Mais recentes' },
  { value: 'created_at', label: 'Mais antigas' },
  { value: 'data_limite', label: 'Prazo mais próximo' },
  { value: '-data_limite', label: 'Prazo mais distante' },
  { value: '-prioridade', label: 'Maior prioridade' },
  { value: 'titulo', label: 'Título A-Z' }
] as const;

export const STATUS_FILTER_OPTIONS: Array<{ value: TarefaStatus | ''; label: string }> = [
  { value: '', label: 'Todos' },
  { value: 'TODO', label: 'A fazer' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'DONE', label: 'Concluída' }
];

export const PRIORIDADE_FILTER_OPTIONS: Array<{ value: TarefaPrioridade | ''; label: string }> = [
  { value: '', label: 'Todas' },
  { value: 'LOW', label: 'Baixa' },
  { value: 'MEDIUM', label: 'Média' },
  { value: 'HIGH', label: 'Alta' }
];

export const ARQUIVADA_FILTER_OPTIONS: Array<{ value: ArquivadaFilter; label: string }> = [
  { value: '', label: 'Todas' },
  { value: 'false', label: 'Somente ativas' },
  { value: 'true', label: 'Somente arquivadas' }
];
