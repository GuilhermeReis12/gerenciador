export type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';

export type TarefaStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TarefaPrioridade = 'LOW' | 'MEDIUM' | 'HIGH';
export type AssignmentType = 'user' | 'team';

export type CurrentUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  link_img?: string;
};

export type UserCapabilities = {
  role: UserRole;
  groups: string[];
  can_create_tasks: boolean;
  can_assign_tasks: boolean;
  can_view_all_tasks: boolean;
  can_manage_team: boolean;
  can_complete_assigned: boolean;
  can_archive_tasks: boolean;
  can_delete_tasks: boolean;
  can_manage_permissions: boolean;
  can_manage_equipes?: boolean;
  active_empresa_id?: number | null;
};

export type Tarefa = {
  id: number;
  titulo: string;
  descricao?: string | null;
  status: TarefaStatus;
  prioridade: TarefaPrioridade;
  data_limite?: string | null;
  arquivada: boolean;
  user?: number;
  created_by_name?: string;
  assigned_to?: number | null;
  assigned_to_name?: string | null;
  link?: string | null;
  assigned_team?: number | null;
  assigned_team_name?: string | null;
  empresa_nome?: string | null;
  is_assigned_to_me?: boolean;
  can_work?: boolean;
};

export type TarefaMetrics = {
  total: number;
  open: number;
  done: number;
  overdue: number;
  archived: number;
  urgent: number;
  assigned_to_me?: number;
  in_progress?: number;
  by_assignee?: Array<{
    assigned_to__name?: string;
    assigned_to__username?: string;
    status: TarefaStatus;
    total: number;
  }>;
};

export type Paginated<T> = {
  results: T[];
  count: number;
  total_pages: number;
  next?: string | null;
  previous?: string | null;
};

export type AssignableUser = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  groups?: string[];
};

export type AssignableTeam = {
  id: number;
  nome: string;
  membros_count?: number;
};

export type GroupPermission = {
  id: number;
  group: number;
  group_name: string;
  can_create_tasks: boolean;
  can_assign_tasks: boolean;
  can_view_all_tasks: boolean;
  can_manage_team: boolean;
  can_complete_assigned: boolean;
  can_archive_tasks: boolean;
  can_delete_tasks: boolean;
  can_manage_permissions: boolean;
};

export type Notificacao = {
  id: number;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  tarefa?: number | null;
  tarefa_titulo?: string | null;
  created_at: string;
};

export const statusLabel: Record<TarefaStatus, string> = {
  TODO: 'A fazer',
  IN_PROGRESS: 'Em andamento',
  DONE: 'Concluída'
};

export const prioridadeLabel: Record<TarefaPrioridade, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta'
};

export const roleLabel: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gestor',
  OPERATOR: 'Operador',
  VIEWER: 'Leitor'
};

export const capabilityLabels: Record<keyof Omit<UserCapabilities, 'role' | 'groups'>, string> = {
  can_create_tasks: 'Criar tarefas',
  can_assign_tasks: 'Atribuir tarefas',
  can_view_all_tasks: 'Ver todas as tarefas',
  can_manage_team: 'Gerenciar equipe',
  can_complete_assigned: 'Executar tarefas atribuídas',
  can_archive_tasks: 'Arquivar tarefas',
  can_delete_tasks: 'Excluir tarefas',
  can_manage_permissions: 'Gerenciar permissões'
};

export function canManageTasks(capabilities?: UserCapabilities | null): boolean {
  return !!capabilities?.can_manage_team || !!capabilities?.can_create_tasks;
}

export function canWriteTasks(capabilities?: UserCapabilities | null): boolean {
  return !!capabilities?.can_create_tasks || !!capabilities?.can_complete_assigned;
}
