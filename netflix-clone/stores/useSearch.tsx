import { create } from 'zustand';

interface IStore {
	searchText: string;
	setSearchText: (text: string) => void;
}

export const useSearch = create<IStore>((set) => ({
	searchText: '',
	setSearchText: (text: string) => set({ searchText: text }),
}));
