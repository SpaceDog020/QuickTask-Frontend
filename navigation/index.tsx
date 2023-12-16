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
import TeamDashboardScreen from "../screens/Team/TeamDashboardScreen";
import EditTeamScreen from "../screens/Team/EditTeamScreen";
import AddUserScreen from "../screens/Team/User/AddUserScreen";
import UserDetailsScreen from "../screens/Team/User/UserDetailsScreen";
import ProjectCreationScreen from "../screens/Project/ProjectCreationScreen";
import ViewProjectsScreen from "../screens/Project/ViewProjectsScreen";
import ProjectDashboardScreen from "../screens/Project/ProjectDashboardScreen";
import TeamDetailsScreen from "../screens/Project/Team/TeamDetailsScreen";
import EditProjectScreen from "../screens/Project/EditProjectScreen";
import AddTeamScreen from "../screens/Project/Team/AddTeamScreen";
import TaskCreationScreen from "../screens/Project/Task/TaskCreationScreen";
import ViewTasksScreen from "../screens/Project/Task/ViewTasksScreen";
import TaskDetailsScreen from "../screens/Project/Task/TaskDetailsScreen";
import EditTaskScreen from "../screens/Project/Task/EditTaskScreen";


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
      <Stack.Screen name="TeamDashboard" component={TeamDashboardScreen} />
      <Stack.Screen name="EditTeam" component={EditTeamScreen} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="ProjectCreation" component={ProjectCreationScreen} />
      <Stack.Screen name="ViewProjects" component={ViewProjectsScreen} />
      <Stack.Screen name="ProjectDashboard" component={ProjectDashboardScreen} />
      <Stack.Screen name="TeamDetails" component={TeamDetailsScreen} />
      <Stack.Screen name="EditProject" component={EditProjectScreen} />
      <Stack.Screen name="AddTeam" component={AddTeamScreen} />      
      <Stack.Screen name="TaskCreation" component={TaskCreationScreen} />
      <Stack.Screen name="ViewTasks" component={ViewTasksScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <Stack.Screen name="EditTask" component={EditTaskScreen} />


    </Stack.Navigator>
  );
}