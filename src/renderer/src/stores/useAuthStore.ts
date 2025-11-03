import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { LoginUserForMobile } from '@/types/models/auth';

type AuthState = {
  isAuthenticating: boolean;
  currentUser: LoginUserForMobile | null;
};

type AuthAction = {
  setCurrentUser: (user: LoginUserForMobile | null) => void;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
};

const initialState: AuthState = {
  isAuthenticating: false,
  currentUser: null,
};

type AuthStore = AuthState & AuthAction;

export const useAuthStore = create<AuthStore>()(
  persist(
    immer<AuthStore>((set) => ({
      ...initialState,
      setCurrentUser: (user: LoginUserForMobile | null) => {
        set(() => ({
          currentUser: user,
        }));
      },
      setIsAuthenticating: (isAuthenticating: boolean) => {
        set(() => ({
          isAuthenticating,
        }));
      },
    })),
    {
      name: 'auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
