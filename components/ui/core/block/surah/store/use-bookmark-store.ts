import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ayat } from '../types/surah-type';

export interface BookmarkType extends Ayat {
  id: string;
}

interface bookmarkStoreType {
  Bookmark: BookmarkType[];
}

const INITIAL_BOOKMARK_STATE = {
  Bookmark: [],
};

export const useBookmarkStore = create<bookmarkStoreType>()(
  persist(
    (set) => ({
      ...INITIAL_BOOKMARK_STATE,
    }),
    {
      name: 'bookmark-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const addBookmark = (ayat: BookmarkType) =>
  useBookmarkStore.setState((state) => ({
    Bookmark: [...state.Bookmark, ayat],
  }));

export const removeBookmark = (id: string) =>
  useBookmarkStore.setState((state) => ({
    Bookmark: state.Bookmark.filter((item) => item.id != id),
  }));
