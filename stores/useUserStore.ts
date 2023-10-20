import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UseUserStoreT = {
  accessToken?: string;
  recoveryPass?: number;
  userName?: string;
  userLastName?: string;
  userEmail?: string;
  teamId?: number;
  setRecoveryPass: (recoveryPass: number) => void;
  setAccessToken: (accessToken: string) => void;
  removeAccessToken: () => void;
  setUserName: (userName: string) => void;
  setUserLastName: (userLastName: string) => void;
  setUserEmail: (userEmail: string) => void;
  setTeamId: (teamId: number) => void;
};

export const useUserStore = create<UseUserStoreT>()(
  devtools(
    persist(
      (set, get) => ({
        accessToken: undefined,
        recoveryPass: undefined,
        userName: undefined,
        userLastName: undefined,
        userEmail: undefined,
        teamId: undefined,
        setRecoveryPass: (recoveryPass: number) => set(() => ({ recoveryPass })),
        setAccessToken: (accessToken: string) => set(() => ({ accessToken })),
        removeAccessToken: () => set(() => ({ accessToken: undefined })),
        setUserName: (userName: string) => set(() => ({ userName })),
        setUserLastName: (userLastName: string) => set(() => ({ userLastName })),
        setUserEmail: (userEmail: string) => set(() => ({ userEmail })),
        setTeamId: (teamId: number) => set(() => ({ teamId })),
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);