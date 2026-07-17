export interface HadistResponse {
  status: number;
  data: Datum[];
}

export interface Datum {
  no: string;
  judul: string;
  arab: string;
  indo: string;
}
