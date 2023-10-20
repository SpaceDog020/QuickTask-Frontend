import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  PassReset: undefined;
  PassVal: undefined;
  ChangePass: undefined;
  Register: undefined;
  Dashboard: undefined;
  UserProfile: undefined;
  EditUserProfile: undefined;
  ChangePassword: undefined;
  TeamCreationScreen: undefined;
  ViewTeams: undefined;
  DeleteUserScreen: undefined;
  TeamDetails: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;