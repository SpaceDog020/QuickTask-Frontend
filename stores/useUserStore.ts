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
  teamName?: string;
  teamDescription?: string;
  teamCreatorId?: number;
  userId?: number;
  projectId?: number;
  projectName?: string;
  projectDescription?: string;
  projectTeamsIds?: number[];
  setRecoveryPass: (recoveryPass: number) => void;
  setAccessToken: (accessToken: string) => void;
  removeAccessToken: () => void;
  setUserName: (userName: string) => void;
  setUserLastName: (userLastName: string) => void;
  setUserEmail: (userEmail: string) => void;
  setTeamId: (teamId: number) => void;
  setTeamName: (teamName: string) => void;
  setTeamDescription: (teamDescription: string) => void;
  setTeamCreatorId: (teamCreatorId: number) => void;
  setUserId: (userId: number) => void;
  setProjectId: (projectId: number) => void;
  setProjectName: (projectName: string) => void;
  setProjectDescription: (projectDescription: string) => void;
  setProjectTeamsIds: (projectTeamsIds: number[]) => void;
  removeTeamDetails: () => void;
  removeProjectDetails: () => void;
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
        teamName: undefined,
        teamDescription: undefined,
        teamCreatorId: undefined,
        userId: undefined,
        projectId: undefined,
        projectName: undefined,
        projectDescription: undefined,
        projectTeamsIds: undefined,
        setRecoveryPass: (recoveryPass: number) => set(() => ({ recoveryPass })),
        setAccessToken: (accessToken: string) => set(() => ({ accessToken })),
        removeAccessToken: () => set(() => ({ accessToken: undefined })),
        setUserName: (userName: string) => set(() => ({ userName })),
        setUserLastName: (userLastName: string) => set(() => ({ userLastName })),
        setUserEmail: (userEmail: string) => set(() => ({ userEmail })),
        setTeamId: (teamId: number) => set(() => ({ teamId })),
        setTeamName: (teamName: string) => set(() => ({ teamName })),
        setTeamDescription: (teamDescription: string) => set(() => ({ teamDescription })),
        setTeamCreatorId: (teamCreatorId: number) => set(() => ({ teamCreatorId })),
        setUserId: (userId: number) => set(() => ({ userId })),
        setProjectId: (projectId: number) => set(() => ({ projectId })),
        setProjectName: (projectName: string) => set(() => ({ projectName })),
        setProjectDescription: (projectDescription: string) => set(() => ({ projectDescription })),
        setProjectTeamsIds: (projectTeamsIds: number[]) => set(() => ({ projectTeamsIds })),
        removeTeamDetails: () => set(() => ({ teamId: undefined, teamName: undefined, teamDescription: undefined, teamCreatorId: undefined })),
        removeProjectDetails: () => set(() => ({ projectId: undefined, projectName: undefined, projectDescription: undefined, projectTeamsIds: undefined })),

      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);