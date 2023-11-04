import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Importa el icono
import Spacing from '../constants/Spacing';
import FontSize from '../constants/FontSize';
import Colors from '../constants/Colors';
import Font from '../constants/Font';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useUserStore } from '../stores/useUserStore';

const { height, width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userName, setUserName } = useUserStore();
  const { userLastName, setUserLastName } = useUserStore();
  const { userEmail, setUserEmail } = useUserStore();
  const { removeAccessToken } = useUserStore();
  const { userId, setUserId } = useUserStore();

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
      icon: 'user', // Nombre del icono de FontAwesome
      onPress: () => navigate('UserProfile'),
    },
    {
      label: 'Ver Equipos',
      icon: 'list', // Nombre del icono de FontAwesome
      onPress: () => navigate('ViewTeams'),
    },
    {
      label: 'Crear Equipo',
      icon: 'plus', // Nombre del icono de FontAwesome
      onPress: () => navigate('TeamCreationScreen'),
    },
    {
      label: 'Cerrar Sesión',
      icon: 'sign-out', // Nombre del icono de FontAwesome
      onPress: logout,
    },
  ];

  return (
    <SafeAreaView>
      <View>
        <View
          style={{
            paddingHorizontal: Spacing * 4,
            paddingTop: Spacing * 4,
          }}>
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
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: Spacing * 4, }}>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            onPress={button.onPress}
            style={{
              margin: Spacing / 2, // Añade margen para separar los botones
              backgroundColor: Colors.primary,
              padding: Spacing * 1.5,
              borderRadius: 10, // Ajusta el radio para que sean cuadrados
              shadowColor: Colors.primary,
              shadowOffset: {
                width: 0,
                height: Spacing,
              },
              shadowOpacity: 0.3,
              shadowRadius: Spacing,
            }}>
            <FontAwesome // Renderiza el icono
              name={button.icon}
              size={30} // Tamaño del icono
              color={Colors.onPrimary} // Color del icono
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});