import React, { useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppTextInput from "../../components/AppTextInput";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import FontSize from "../../constants/FontSize";
import Spacing from "../../constants/Spacing";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { CHANGEPASSWORD } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useUserStore } from "../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";


type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

const ChangePassword: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    userEmail: initialUserEmail
  } = useUserStore();

  const [changePassword] = useMutation(CHANGEPASSWORD);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const handleChangePassword = async () => {
    setIsSubmitting(true);
    if (newPassword === "" || repeatNewPassword === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      if (newPassword === repeatNewPassword) {
        try {
          setIsLoading(true);
          const { data } = await changePassword({
            variables: {
              email: initialUserEmail,
              oldPassword: currentPassword,
              newPassword: newPassword,
            },
          });
          setIsLoading(false);
          if (data && data.changePassword) {
            Toast.show({
              type: "success",
              text1: "Contraseña ha sido cambiada",
              text2: "Volviendo a perfil",
              position: "bottom",
              visibilityTime: 3000, // Duration in milliseconds
              autoHide: true,
            });
            navigate("UserProfile");
          } else {
            setIsSubmitting(false);
            setIsLoading(false);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Contraseña incorrecta",
              position: "bottom",
              visibilityTime: 3000, // Duration in milliseconds
              autoHide: true,
            });
          }

        }
        catch (e) {
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
      } else {
        setIsSubmitting(false);
        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Las contraseñas no coinciden",
          position: "bottom",
          visibilityTime: 3000, // Duration in milliseconds
          autoHide: true,
        });
      }
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity
        disabled={isLoading || isSubmitting}
          style={{
            position: "absolute",
            top: Spacing * 5,
            left: Spacing * 0.5,
            zIndex: 1,
          }}
          onPress={() => navigate("UserProfile")}
        >
          <Icon
            raised
            size={25}
            name="arrow-back"
            type="Ionicons"
            color={Colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Cambio de Contraseña</Text>

        <AppTextInput
          placeholder="Contraseña actual"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />

        <AppTextInput
          placeholder="Contraseña nueva"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <AppTextInput
          placeholder="Repita la contraseña nueva"
          value={repeatNewPassword}
          onChangeText={setRepeatNewPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
            },
          ]}
          onPress={handleChangePassword}
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Text style={styles.buttonText}>Cambiar contraseña</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing * 2,
  },
  title: {
    fontSize: FontSize.xLarge,
    color: Colors.primary,
    fontFamily: Font["poppins-bold"],
    marginVertical: Spacing * 3,
    textAlign: "center",
  },
  button: {
    padding: Spacing * 2,
    marginVertical: Spacing * 7,
    borderRadius: Spacing,
  },
  buttonText: {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },
});

export default ChangePassword;