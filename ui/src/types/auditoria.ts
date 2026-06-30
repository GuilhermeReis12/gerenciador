export type AuditAction =
  | 'CREATED'
  | 'UPDATED'
  | 'DELETED'
  | 'STATUS_CHANGED'
  | 'ARCHIVED'
  | 'RESTORED'
  | 'BULK_UPDATED'
  | 'ASSIGNED';

export type AuditLog = {
  id: number;
  action: AuditAction | string;
  payload_json: Record<string, unknown> | null;
  created_at: string;
  user_name: string;
  tarefa: number | null;
};

export const auditActionLabel: Record<string, string> = {
  CREATED: 'Criada',
  UPDATED: 'Atualizada',
  DELETED: 'Excluída',
  STATUS_CHANGED: 'Status alterado',
  ARCHIVED: 'Arquivada',
  RESTORED: 'Desarquivada',
  BULK_UPDATED: 'Atualização em lote',
  ASSIGNED: 'Atribuída'
};
