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
import { useUserStore } from "../../stores/useUserStore";
import { CHANGEPASSRECOVERY } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "ChangePass">;

const ChangePassScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { recoveryPass, setRecoveryPass } = useUserStore();

  const [changePassRecovery, { data, loading }] = useMutation(CHANGEPASSRECOVERY);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1000,
    isSubmitting
  );

  const handleChangePass = async (password: string, password2: string) => {
    setIsSubmitting(true);
    if (password === "" || password2 === "") {
      Toast.show({
        type: 'error',
        text1: 'Debe llenar todos los campos',
        text2: 'Intente nuevamente',
        position: 'bottom', // Display at the bottom
        visibilityTime: 1000, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      if (password === password2) {
        setIsLoading(true);
        try {
          const { data } = await changePassRecovery({
            variables: {
              password,
              recoveryPass,
            },
          });
          setIsLoading(false);
          if (data && data.changePassRecovery) {
            Toast.show({
              type: "success",
              text1: "Contraseña cambiada",
              text2: "Inicie sesión",
              position: "bottom",
              visibilityTime: 1250, // Duration in milliseconds
              autoHide: true,
            });
            setRecoveryPass(0);
            navigate("Login");
          }
        } catch (e) {
          setIsSubmitting(false);
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: e.message,
            position: 'bottom', // Display at the bottom
            visibilityTime: 1000, // Duration in milliseconds
            autoHide: true,
          });
        }
      } else {
        setIsSubmitting(false);
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Las contraseñas no coinciden',
          text2: 'Intente nuevamente',
          position: 'bottom', // Display at the bottom
          visibilityTime: 1000, // Duration in milliseconds
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
              top: Spacing * 2,
              left: -Spacing,
              zIndex: 1,
            }}
            onPress={() => navigate("Login")}
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
            Cambiar Contraseña
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
              textAlign: "center",
            }}
          >
            Ingrese su contraseña nueva
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
          <AppTextInput
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View
          style={{
            marginVertical: -30,
          }}
        >
          <AppTextInput
            placeholder="Confirmar Contraseña"
            value={password2}
            onChangeText={setPassword2}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          disabled={isLoading || isSubmitting}
          onPress={() => handleChangePass(password, password2)}
          style={{
            padding: Spacing * 2,
            backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
            marginVertical: Spacing * 7,
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
              Cambiar contraseña
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassScreen;

const styles = StyleSheet.create({});
