export type Equipe = {
  id: number;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  membros: number[];
  membros_count: number;
  membros_detail?: Array<{ id: number; name: string; email: string }>;
};
