import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../constants/Colors";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Welcome from "../screens/WelcomeScreen";
import Dashboard from "../screens/Dashboard";
import PassResetScreen from "../screens/PassResetScreen";
import UserProfile from "../screens/UserProfile";
import { RootStackParamList } from "../types";
import PassValScreen from "../screens/PassValScreen";
import ChangePassScreen from "../screens/ChangePassScreen";
import ChangePassword from "../screens/ChangePassword";
import TeamCreationScreen from "../screens/TeamCreationScreen";
import ViewTeamsScreen from "../screens/ViewTeamsScreen";
import DeleteUserScreen from "../screens/DeleteUserScreen";

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
      <Stack.Screen name="TeamCreationScreen" component={TeamCreationScreen} />
      <Stack.Screen name="DeleteUserScreen" component={DeleteUserScreen} />

    </Stack.Navigator>
  );
}
