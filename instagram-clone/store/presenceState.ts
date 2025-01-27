import { create } from 'zustand';

interface State {
	presence: null;
	setPresence: (value) => void;
}

export const usePresenceState = create<State>((set) => ({
	presence: null,
	setPresence: (value) => set({ presence: value }),
}));
