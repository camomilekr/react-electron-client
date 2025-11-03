import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type CommonState = {
  isVisibleOverlayLoading: boolean;
  isNavigationDrawerOpen: boolean;
};

type CommonAction = {
  setVisibleOverlayLoading: (isVisibleOverlayLoading: boolean) => void;
  setIsNavigationDrawerOpen: (isNavigationDrawerOpen: boolean) => void;
};

const initialState: CommonState = {
  isVisibleOverlayLoading: false,
  isNavigationDrawerOpen: false,
};

type CommonStore = CommonState & CommonAction;

export const useCommonStore = create<CommonStore>()(
  persist(
    immer<CommonStore>((set) => ({
      ...initialState,
      setVisibleOverlayLoading: (isVisibleOverlayLoading: boolean) => {
        set(() => ({
          isVisibleOverlayLoading,
        }));
      },
      setIsNavigationDrawerOpen: (isNavigationDrawerOpen: boolean) => {
        set(() => ({
          isNavigationDrawerOpen,
        }));
      },
    })),
    {
      name: 'common',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
