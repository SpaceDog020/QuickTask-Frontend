import {
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

type Props = NativeStackScreenProps<RootStackParamList, "ChangePass">;

const ChangePassScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { recoveryPass, setRecoveryPass } = useUserStore();

  const [changePassRecovery, { data, loading }] = useMutation(CHANGEPASSRECOVERY);

  const handleChangePass = async (password: string, password2: string) => {
    if (password === "" || password2 === "") {
      alert("Todos los campos deben estar llenos");
    } else {
      if (password === password2) {
        try {
          const { data } = await changePassRecovery({
            variables: {
              password,
              recoveryPass,
            },
          });
          if (data && data.changePassRecovery) {
            alert("Contraseña cambiada con exito");
            setRecoveryPass(0);
            navigate("Login");
          }
        } catch (e) {
          alert("Contraseña ya utilizada");
          console.log(e);
        }
      } else {
        alert("Las contraseñas no coinciden");
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
              textAlign: "center",
            }}
          >
            Cambiar Contraseña
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
              maxWidth: "60%",
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
          onPress={() => handleChangePass(password, password2)}
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.primary,
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
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate("Login")}
          onPressIn={() => setRecoveryPass(0)}
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
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassScreen;

const styles = StyleSheet.create({});
