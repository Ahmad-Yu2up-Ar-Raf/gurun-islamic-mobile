import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'BOOKMARKS';

export async function getBookmarks(): Promise<string[]> {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveBookmarks(bookmarks: string[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(bookmarks));
}
