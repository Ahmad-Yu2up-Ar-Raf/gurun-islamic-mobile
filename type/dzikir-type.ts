export interface DzikirResponse {
  status: number;
  data: Datum[];
}

export interface Datum {
  type: Type;
  arab: string;
  indo: string;
  ulang: Ulang;
}

export enum Type {
  Pagi = 'pagi',
  Solat = 'solat',
  Sore = 'sore',
}

export enum Ulang {
  The100X = '100x',
  The10X = '10x',
  The1X = '1x',
  The33X = '33x',
  The3X = '3x',
  The4X = '4x',
}
