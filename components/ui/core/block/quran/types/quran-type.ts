export interface SuraType {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: TempatTurun;
  arti: string;
  deskripsi: string;
  audioFull: { [key: string]: string };
}

export enum TempatTurun {
  Madinah = 'Madinah',
  Mekah = 'Mekah',
}

export interface QuranResponse {
  code: number;
  message: string;
  data: SuraType[];
}
