import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import AppTextInput from "../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutations";
import { useUserStore } from '../stores/useUserStore';

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { accessToken, setAccessToken } = useUserStore();
  const { recoveryPass, setRecoveryPass } = useUserStore();

  const [login, { data, loading }] = useMutation(LOGIN);

  const handleLogin = async (email: string, password: string) => {
    if(email === '' || password === ''){
      alert('Todos los campos deben estar llenos');
    }else{
      try{
        const { data } = await login({
          variables: {
            email,
            password,
          },
        });
        if (data && data.login) {
          setAccessToken(data.login.accessToken);
          navigate("Dashboard")
        }
      }catch(e){
        alert("Credenciales incorrectas");
        console.log(e);
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
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
            }}
          >
            Inicia sesion
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
          <AppTextInput placeholder="Correo" keyboardType="email-address" value={email} onChangeText={setEmail}/>
          <AppTextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry/>
        </View>

        <TouchableOpacity
          onPress={() => navigate("PassReset")}
        >
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.small,
              color: Colors.primary,
              alignSelf: "flex-end",
            }}
          >
            Olvide mi contraseña
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => handleLogin(email, password)}
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.primary,
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
          <Text
            style={{
              fontFamily: Font["poppins-bold"],
              color: Colors.onPrimary,
              textAlign: "center",
              fontSize: FontSize.large,
            }}
          >
            Iniciar Sesion
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("Register")}
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
