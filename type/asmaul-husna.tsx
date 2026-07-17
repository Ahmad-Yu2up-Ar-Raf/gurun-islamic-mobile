export interface AsmaulHusnaResponse {
  statusCode: number;
  total: number;
  data: Datum[];
}

export interface Datum {
  urutan: number;
  latin: string;
  arab: string;
  arti: string;
}
