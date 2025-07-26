export interface Produto {
  id: string;
  codigo: string;
  descricao: string;
  departamentoId: number;
  departamentoCodigo: string;
  departamentoNome: string;
  preco: number;
  status: boolean;
}
