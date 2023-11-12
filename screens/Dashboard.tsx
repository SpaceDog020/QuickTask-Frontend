import React, { useEffect } from 'react';
import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Spacing from '../constants/Spacing';
import FontSize from '../constants/FontSize';
import Colors from '../constants/Colors';
import Font from '../constants/Font';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useUserStore } from '../stores/useUserStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userName, setUserName } = useUserStore();
  const { setUserLastName } = useUserStore();
  const { setUserEmail } = useUserStore();
  const { removeAccessToken } = useUserStore();
  const { setUserId } = useUserStore();

  const logout = async () => {
    await removeAccessToken();
    setUserName('');
    setUserLastName('');
    setUserEmail('');
    setUserId(-1);
    navigate('Welcome');
  };

  const buttons = [
    {
      label: 'Tu Perfil',
      icon: 'user',
      onPress: () => navigate('UserProfile'),
    },
    {
      label: 'Cerrar Sesión',
      icon: 'sign-out',
      onPress: logout,
    },
    {
      label: 'Ver Equipos',
      icon: 'list',
      onPress: () => navigate('ViewTeams'),
    },
    {
      label: 'Crear Equipo',
      icon: 'plus',
      onPress: () => navigate('TeamCreation'),
    },
    {
      label: 'Ver Proyectos',
      icon: 'list',
      onPress: () => navigate('ViewTeams'),
    },
    {
      label: 'Crear Proyectos',
      icon: 'plus',
      onPress: () => navigate('ProjectCreation'),
    },
  ];

  const buttonColors = {
    'Tu Perfil': 'blue',
    'Cerrar Sesión': 'blue',
    'Ver Equipos': 'royalblue',
    'Crear Equipo': 'royalblue',
    'Ver Proyectos': 'dodgerblue',
    'Crear Proyectos': 'dodgerblue',
  };

  useEffect(() => {
    const backAction = () => {
      logout();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ marginBottom: Spacing * 3 }}>
        <Text
          style={{
            fontSize: FontSize.xxLarge,
            color: Colors.primary,
            fontFamily: Font['poppins-bold'],
            textAlign: 'center',
          }}>
          Bienvenido
        </Text>
        <Text
          style={{
            fontSize: FontSize.large,
            fontFamily: Font['poppins-bold'],
            textAlign: 'center',
          }}>
          {userName}
        </Text>
        <Text
          style={{
            marginTop: Spacing * 5,
            fontSize: FontSize.large,
            fontFamily: Font['poppins-bold'],
            textAlign: 'center',
          }}>
          ¿Qué deseas hacer hoy?
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: Spacing * 2 }}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={button.onPress}
            style={{
              width: 160,
              height: 120,
              margin: Spacing / 2,
              backgroundColor: buttonColors[button.label],
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}>
            <FontAwesome
              name={button.icon}
              size={50}
              color={Colors.onPrimary}
            />
            <Text
              style={{
                color: Colors.onPrimary,
                fontFamily: Font['poppins-bold'],
                textAlign: 'center',
              }}>
              {button.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});