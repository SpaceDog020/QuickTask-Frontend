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
import { VALIDATERECOVERY } from "../../graphql/mutations";
import { useUserStore } from "../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";
import GradientWrapper from "../../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "PassVal">;

const PassValScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const { recoveryPass, setRecoveryPass } = useUserStore();

  const [validateRecovery, { data, loading }] = useMutation(VALIDATERECOVERY);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1000,
    isSubmitting
  );

  const handleValidation = async (code: string) => {
    setIsSubmitting(true);
    if (code === "") {
      Toast.show({
        type: "error",
        text1: "Debe llenar todos los campos",
        text2: "Intente nuevamente",
        position: "bottom", // Display at the bottom
        visibilityTime: 1000, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        setIsLoading(true);
        const aux = parseInt(code);
        const { data } = await validateRecovery({
          variables: {
            recoveryPass: aux,
          },
        });
        setIsLoading(false);
        if (data && data.validateRecovery) {
          setRecoveryPass(aux);
          Toast.show({
            type: "success",
            text1: "Codigo correcto",
            text2: "Ingrese su nueva contraseña",
            position: "bottom",
            visibilityTime: 1250, // Duration in milliseconds
            autoHide: true,
          });
          navigate("ChangePass");
        }
      } catch (e) {
        setIsSubmitting(false);
        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: e.message,
          position: "bottom",
          visibilityTime: 1500, // Duration in milliseconds
          autoHide: true,
        });
      }
    }
  };

  return (
    <GradientWrapper>
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
                name="arrow-back"
                type="Ionicons"
                color={Colors.primary}
              />
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
              Validar Codigo
            </Text>
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.large,
                textAlign: "center",
              }}
            >
              Si el correo es correcto, recibira un codigo de verificacion
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 3,
            }}
          >
            <AppTextInput
              placeholder="Codigo"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
          </View>

          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            onPress={() => handleValidation(code)}
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
                Cambiar contraseña
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default PassValScreen;

const styles = StyleSheet.create({});
