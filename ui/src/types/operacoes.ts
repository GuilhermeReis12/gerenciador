export type Empresa = {
  id: number;
  nome: string;
  cnpj: string;
};

export type OperacaoTipo = 'TASK' | 'PRODUCT' | 'STOCK';

export type RegistroOperacao = {
  id: number;
  tipo: OperacaoTipo;
  titulo: string;
  descricao?: string | null;
  sku?: string | null;
  quantidade: string;
  unidade: string;
  ativo: boolean;
  empresa?: number;
};

export const operacaoTipoLabel: Record<OperacaoTipo, string> = {
  TASK: 'Tarefa',
  PRODUCT: 'Produto',
  STOCK: 'Estoque'
};
