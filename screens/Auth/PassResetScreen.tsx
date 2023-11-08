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
import { RECOVERY } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";

type Props = NativeStackScreenProps<RootStackParamList, "PassReset">;

const PassResetScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [email, setEmail] = useState("");
  
  const [recovery, { data, loading }] = useMutation(RECOVERY);

  const handleRecovery = async (email: string) => {
    if(email === ''){
      alert('Todos los campos deben estar llenos');
    }else{
      try{
        const { data } = await recovery({
          variables: {
            email,
          },
        });
        if (data && data.recovery) {;
          navigate("PassVal");
        }
      }catch(e){
        navigate("PassVal");
      }
    }
  }

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
            Recuperar Contraseña
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
              maxWidth: "60%",
              textAlign: "center",
            }}
          >
            Ingresa el correo asociado a tu cuenta
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
          <AppTextInput
            placeholder="Correo"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <TouchableOpacity
          onPress={() => handleRecovery(email)}
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
            Recuperar contraseña
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
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PassResetScreen;

const styles = StyleSheet.create({});
