import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AppTextInput from "../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../graphql/mutations";
import { useUserStore } from '../../stores/useUserStore';
import Toast from 'react-native-toast-message';
import useButtonTimeout from "../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { accessToken, setAccessToken } = useUserStore();
  const { recoveryPass, setRecoveryPass } = useUserStore();
  const { userName, setUserName } = useUserStore();
  const { userLastName, setUserLastName } = useUserStore();
  const { userEmail, setUserEmail } = useUserStore();
  const { userId, setUserId } = useUserStore();
  const [login, { data, loading }] = useMutation(LOGIN);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1000,
    isSubmitting
  );

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
    if (email === '' || password === '') {
      Toast.show({
        type: 'error',
        text1: 'Debe llenar todos los campos',
        text2: 'Intente nuevamente',
        position: 'bottom', // Display at the bottom
        visibilityTime: 1000, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      if (!emailRegex.test(email)) {
        Toast.show({
          type: 'error',
          text1: 'Correo electrónico no válido',
          text2: 'Intente nuevamente',
          position: 'bottom',
          visibilityTime: 1500,
          autoHide: true,
        });
        setIsSubmitting(false);
        return;
      }
      try {
        setIsLoading(true);
        const { data } = await login({
          variables: {
            email,
            password,
          },
        });
        setIsLoading(false);
        if (data && data.login) {
          setAccessToken(data.login.accessToken)
          setUserName(data.login.name)
          setUserLastName(data.login.lastName)
          setUserEmail(data.login.email)
          setUserId(data.login.id)
          Toast.show({
            type: "success",
            text1: "Ingreso exitoso",
            text2: "Redirigiendo al dashboard",
            position: "bottom",
            visibilityTime: 1250, // Duration in milliseconds
            autoHide: true,
          });
          navigate("Dashboard")
        }
      } catch (e) {
        setIsSubmitting(false);
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Credenciales incorrectas',
          text2: 'Intente nuevamente',
          position: 'bottom', // Display at the bottom
          visibilityTime: 1500, // Duration in milliseconds
          autoHide: true,
        });
      }
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: Spacing * 2,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >

          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            style={{
              position: "absolute",
              top: Spacing * 1.5,
              left: -Spacing,
              zIndex: 1,
            }}
            onPress={() => navigate("Welcome")}
          >
            <Icon
              raised
              size={25}
              name='arrow-back'
              type='Ionicons'
              color={Colors.primary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
              textAlign: "center",
            }}
          >
            Inicia sesión
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
              maxWidth: "60%",
              textAlign: "center",
            }}
          >
            Ingresa tus datos para continuar
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
          <AppTextInput placeholder="Correo" keyboardType="email-address" value={email} autoComplete="email" onChangeText={setEmail} />
          <AppTextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        <TouchableOpacity
          onPress={() => navigate("PassReset")}
          disabled={isLoading || isSubmitting}
        >
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.small,
              color: Colors.primary,
              alignSelf: "flex-end",
            }}
          >
            Olvidé mi contraseña
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLogin(email, password)}
          disabled={isLoading || isSubmitting}
          style={{
            padding: Spacing * 2,
            backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
            marginVertical: Spacing * 3,
            borderRadius: Spacing,
            shadowColor: Colors.primary,
            shadowOffset: {
              width: 0,
              height: Spacing,
            },
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
          }}
        >
          {isLoading || isSubmitting ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: Colors.onPrimary,
                textAlign: "center",
                fontSize: FontSize.large,
              }}
            >
              Iniciar Sesión
            </Text>

          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("Register")}
          disabled={isLoading || isSubmitting}
          style={{
            padding: Spacing,
          }}
        >
          <Text
            style={{
              fontFamily: Font["poppins-bold"],
              color: Colors.text,
              textAlign: "center",
              fontSize: FontSize.medium,
            }}
          >
            Crear una cuenta nueva
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
