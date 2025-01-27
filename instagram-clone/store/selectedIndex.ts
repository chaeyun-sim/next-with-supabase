import { create } from 'zustand';

interface State {
	selectedUserId: string | null;
	setSelectedUserId: (value: string) => void;
}

export const useSelectedUserId = create<State>((set) => ({
	selectedUserId: null,
	setSelectedUserId: (value) => set({ selectedUserId: value }),
}));
