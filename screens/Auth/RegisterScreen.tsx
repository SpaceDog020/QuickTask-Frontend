import {
  SafeAreaView,
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
import { useMutation } from '@apollo/client';
import { REGISTER } from '../../graphql/mutations';

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [name, setName] = useState('');
  const [lastName, setlastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const [register, { data }] = useMutation(REGISTER);

  const handleRegister = async () => {
    if (name === '' || lastName === '' || email === '' || password === '') {
      alert('Todos los campos deben estar llenos');
    } else {
      try {
        const { data } = await register({
          variables: {
            name,
            lastName,
            email,
            password,
          }
        });
        if (data && data.register) {
          if (data.register.response) {
            alert("Registro exitoso");
            navigate("Login")
          } else {
            alert("Correo ya existente");
          }
        } else {
          console.log("No se encontraron datos de registro");
        }
      } catch (e) {
        alert("Error al registrar");
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
            Crea tu cuenta
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 1,
          }}
        >
          <AppTextInput placeholder="Nombre" value={name} onChangeText={setName} />
          <AppTextInput placeholder="Apellido" value={lastName} onChangeText={setlastName} />
          <AppTextInput placeholder="Correo" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <AppTextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.primary,
            marginVertical: Spacing * 1,
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
            Crear Cuenta
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("Login")}
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
            Ya tengo una cuenta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
