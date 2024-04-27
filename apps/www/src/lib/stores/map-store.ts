import create from 'zustand';

type MapPosition = [number, number];

const initialPosition = {};

interface State {
  markers: {
    guess: MapPosition;
    answer: MapPosition | undefined;
  };
}

interface Actions {
  updateMarker(type: 'guess' | 'answer', position: MapPosition): void;
}

export const useMapStore = create<State & Actions>((set) => ({
  markers: {
    guess: [51.505, -0.09],
    answer: undefined,
  },
  updateMarker: (type, position) => {
    set((state) => {
      return {
        markers: {
          ...state.markers,
          [type]: position,
        },
      };
    });
  },
}));
