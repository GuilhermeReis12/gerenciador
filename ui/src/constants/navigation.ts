import { UserCapabilities } from 'types/tarefas';

export type NavItem = {
  label: string;
  path: string;
  visible?: (capabilities: UserCapabilities) => boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/home' },
  {
    label: 'Minhas Tarefas',
    path: '/minhas-tarefas',
    visible: (c) => c.can_complete_assigned
  },
  {
    label: 'Gerenciar Tarefas',
    path: '/tarefas',
    visible: (c) => c.can_create_tasks
  },
  {
    label: 'Painel Equipe',
    path: '/equipe-tarefas',
    visible: (c) => c.can_manage_team
  },
  {
    label: 'Equipes',
    path: '/equipes',
    visible: (c) => !!c.can_manage_equipes || c.can_manage_team
  },
  { label: 'Agenda', path: '/agenda' },
  { label: 'Relatórios', path: '/relatorios' },
  { label: 'Operações', path: '/operacoes' },
  {
    label: 'Auditoria',
    path: '/auditoria',
    visible: (c) => c.can_manage_team
  },
  {
    label: 'Permissões',
    path: '/permissoes-grupos',
    visible: (c) => c.can_manage_permissions
  },
  { label: 'Meu Perfil', path: '/meu-perfil' }
];
