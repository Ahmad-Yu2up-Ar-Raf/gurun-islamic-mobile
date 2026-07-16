import ky from 'ky';

const BASE_API = process.env.EXPO_PUBLIC_API_URL ?? 'https://equran.id/api/';

export const api = ky.create({
  baseUrl: BASE_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
