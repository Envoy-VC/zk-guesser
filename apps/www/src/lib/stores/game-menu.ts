import { create } from 'zustand';

export const navItems = [
  {
    label: 'Play',
    key: 'play',
    link: '/',
  },
  {
    label: 'Create Game',
    key: 'create-game',
    link: '/create-game',
  },
  {
    label: 'Settings',
    key: 'settings',
    link: '/settings',
  },
] as const;

export type NavItemType = (typeof navItems)[number]['key'];

interface State {
  isOpen: boolean;
  activeItem: NavItemType;
}

interface Actions {
  setOpen: (open: boolean, activeItem: NavItemType) => void;
  setActiveItem: (activeItem: NavItemType) => void;
}

export const useGameMenu = create<State & Actions>((set) => ({
  isOpen: false,
  activeItem: 'play',
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setOpen: (open, item) => set({ isOpen: open, activeItem: item }),
  setActiveItem: (item) => set({ activeItem: item }),
}));
