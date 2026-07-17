export interface SurahResponse {
  code: number;
  message: string;
  data: Surah;
}

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: { [key: string]: string };
  ayat: Ayah[];
  suratSelanjutnya: SuratSenya;
  suratSebelumnya: SuratSenya;
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: { [key: string]: string };
}

export interface SuratSenya {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
}
