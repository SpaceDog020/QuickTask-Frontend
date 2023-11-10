import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../constants/Colors";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import Welcome from "../screens/WelcomeScreen";
import Dashboard from "../screens/Dashboard";
import PassResetScreen from "../screens/Auth/PassResetScreen";
import UserProfile from "../screens/Profile/UserProfile";
import { RootStackParamList } from "../types";
import PassValScreen from "../screens/Auth/PassValScreen";
import ChangePassScreen from "../screens/Auth/ChangePassScreen";
import ChangePassword from "../screens/Profile/ChangePassword";
import TeamCreationScreen from "../screens/Team/TeamCreationScreen";
import ViewTeamsScreen from "../screens/Team/ViewTeamsScreen";
import DeleteUserScreen from "../screens/Profile/DeleteUserScreen";
import TeamDetailsScreen from "../screens/Team/TeamDetailsScreen";
import EditTeamScreen from "../screens/Team/EditTeamScreen";
import AddUserScreen from "../screens/Team/User/AddUserScreen";
import UserDetailsScreen from "../screens/Team/User/UserDetailsScreen";


const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PassVal" component={PassValScreen} />
      <Stack.Screen name="PassReset" component={PassResetScreen} />
      <Stack.Screen name="ChangePass" component={ChangePassScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ViewTeams" component={ViewTeamsScreen} />
      <Stack.Screen name="TeamCreation" component={TeamCreationScreen} />
      <Stack.Screen name="DeleteUser" component={DeleteUserScreen} />
      <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
      <Stack.Screen name="EditTeam" component={EditTeamScreen} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />

    </Stack.Navigator>
  );
}