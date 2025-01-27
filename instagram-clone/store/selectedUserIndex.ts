import { create } from 'zustand';

interface State {
	selectedUserIndex: number;
	setSelectedUserIndex: (value: number) => void;
}

export const useSelectedUserIndex = create<State>((set) => ({
	selectedUserIndex: 0,
	setSelectedUserIndex: (value) => set({ selectedUserIndex: value }),
}));
