import { api } from '@/api/client';

import { useQuery } from '@tanstack/react-query';
import { SurahResponse } from '../types/surah-type';

export const FetchSurah = (id: string) => {
  return useQuery({
    queryKey: ['surah', id, `surah-${id}`],
    queryFn: async () => api.get(`v2/surat/${id}`).json<SurahResponse>(),
  });
};
