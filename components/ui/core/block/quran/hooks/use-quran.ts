import { api } from '@/api/client';
import { useQuery } from '@tanstack/react-query';
import { QuranResponse } from '../types/quran-type';

export const FetchQuran = () => {
  return useQuery({
    queryKey: ['quran'],
    queryFn: async () => api.get('v2/surat').json<QuranResponse>(),
  });
};
