export interface IPerfil {
  id: number;
  email: string;
  cpf: string;
  nm_pessoa: string;
  foto_perfil: string;
  grupos: IGrupoPessoa[];
}

export interface IGrupoPessoa {
  grupo_regional_escola_id: number;
  grupo_id: number;
  grupo_nome: string;
  regional_id: number;
  regional_nome: string;
  escola_id: number;
  escola_nome: string;
}
