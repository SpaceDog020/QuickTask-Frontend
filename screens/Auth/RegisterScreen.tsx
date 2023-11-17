import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AppTextInput from "../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

const RegisterScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [name, setName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [register, { data }] = useMutation(REGISTER);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const handleRegister = async () => {
    setIsSubmitting(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === "" || lastName === "" || email === "" || password === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
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
        const { data } = await register({
          variables: {
            name,
            lastName,
            email,
            password,
          },
        });
        setIsLoading(false);
        if (data && data.register) {
          if (data.register.response) {
            Toast.show({
              type: "success",
              text1: "Registro exitoso",
              text2: "Ahora puede logearse",
              position: "bottom",
              visibilityTime: 3000, // Duration in milliseconds
              autoHide: true,
            });

            navigate("Login");
          } else {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "El correo ya está registrado",
              position: "bottom",
              visibilityTime: 3000, // Duration in milliseconds
              autoHide: true,
            });
          }
        } else {
          console.log("No se encontraron datos de registro");
        }
      } catch (e) {
        setIsSubmitting(false);
        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: e.message,
          position: "bottom",
          visibilityTime: 3000, // Duration in milliseconds
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
          style={{
            position: "absolute",
            top: Spacing * 2,
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
              color={Colors.primary}/>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
              marginHorizontal: Spacing * 5,
              textAlign: "center",
            }}
          >
            Crea tu nueva cuenta
          </Text>
        </View>
        <View>
          <AppTextInput
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />
          <AppTextInput
            placeholder="Apellido"
            value={lastName}
            onChangeText={setlastName}
          />
          <AppTextInput
            placeholder="Correo"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <AppTextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={isLoading || isSubmitting}
          style={{
            padding: Spacing * 2,
            backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
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
          // Disable the button when submitting
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
              Crear Cuenta
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("Login")}
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
            Ya tengo una cuenta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
