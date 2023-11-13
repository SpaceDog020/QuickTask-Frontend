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
import { RECOVERY } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "PassReset">;

const PassResetScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [recovery, { data, loading }] = useMutation(RECOVERY);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );
  
  const handleRecovery = async (email: string) => {
    setIsSubmitting(true);
    if(email === ''){
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    }else{
      try{
        setIsLoading(true);
        const { data } = await recovery({
          variables: {
            email,
          },
        });
        setIsLoading(false);
        if (data && data.recovery) {
          navigate("PassVal");
        }
      }catch(e){
        setIsSubmitting(false);
        setIsLoading(false);
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
              color={Colors.primary}/>
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
            Recuperar Contraseña
          </Text>
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.large,
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
          disabled={isSubmitting || isLoading}
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
            Recuperar contraseña
          </Text>
          )}
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

export default PassResetScreen;

const styles = StyleSheet.create({});
