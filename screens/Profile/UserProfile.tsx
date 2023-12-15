import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { useUserStore } from "../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import AppTextInput from "../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { UPDATEUSER } from "../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";
import GradientWrapper from "../../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "UserProfile">;

const capitalizeFirstLetter = (str: string) => {
  const lowercasedStr = str.toLowerCase();
  return lowercasedStr.charAt(0).toUpperCase() + lowercasedStr.slice(1);
};

const UserProfile: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userName: initialUserName, setUserName: setInitialUserName } =
    useUserStore();
  const {
    userLastName: initialUserLastName,
    setUserLastName: setInitialUserLastName,
  } = useUserStore();
  const { userEmail: initialUserEmail, setUserEmail: setInitialUserEmail } =
    useUserStore();
  const { role: initialRole, setRole: setInitialRole } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(initialUserName);
  const [userLastName, setUserLastName] = useState(initialUserLastName);
  const [userEmail, setUserEmail] = useState(initialUserEmail.toLowerCase());
  const [role, setRole] = useState(initialRole);
  const [newName, setNewName] = useState(userName);
  const [newLastName, setNewLastName] = useState(userLastName);
  const [newEmail, setNewEmail] = useState(userEmail);
  const [newRole, setNewRole] = useState(role);

  const [editable, setEditable] = useState(false);
  const [updateUser] = useMutation(UPDATEUSER);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1000,
    isSubmitting
  );

  const handleButtonPress = () => {
    if (editable) {
      if (
        newName !== userName ||
        newLastName !== userLastName ||
        newRole !== role ||
        newEmail.toLowerCase() !== userEmail.toLowerCase()
      ) {
        setNewName(userName);
        setNewLastName(userLastName);
        setNewEmail(userEmail.toLowerCase());
        setNewRole(role);
      }
    }

    setEditable(!editable);
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      newName === "" ||
      newLastName === "" ||
      newEmail === "" ||
      newRole === ""
    ) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      if (!emailRegex.test(newEmail)) {
        Toast.show({
          type: "error",
          text1: "Correo electrónico no válido",
          text2: "Intente nuevamente",
          position: "bottom",
          visibilityTime: 1500,
          autoHide: true,
        });
        setIsSubmitting(false);
        return;
      }
      try {
        setIsLoading(true);
        // Call the updateUser mutation with the updated user data
        await updateUser({
          variables: {
            oldEmail: userEmail.toLowerCase(),
            name: newName,
            lastName: newLastName,
            email: newEmail.toLowerCase(),
            role: newRole,
          },
        });
        // Update the user data in your local state
        setUserName(newName);
        setInitialUserName(newName);
        setUserLastName(newLastName);
        setInitialUserLastName(newLastName);
        setUserEmail(newEmail.toLowerCase());
        setInitialUserEmail(newEmail.toLowerCase());
        setRole(newRole);
        setInitialRole(newRole);
        setIsLoading(false);
        Toast.show({
          type: "success",
          text1: "Datos actualizados",
          text2: "Se han guardado los datos",
          position: "bottom",
          visibilityTime: 3000, // Duration in milliseconds
          autoHide: true,
        });

        // Disable editability after saving changes
        setIsSubmitting(false);
        setEditable(false);
      } catch (e) {
        setIsSubmitting(false);
        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: "Error al actualizar datos",
          text2: e.message,
          position: "bottom",
          visibilityTime: 3000, // Duration in milliseconds
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
            marginTop: Spacing * 2,
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
                top: Spacing * 1,
                left: -Spacing,
                zIndex: 1,
              }}
              onPress={() => navigate("Dashboard")}
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
                marginVertical: Spacing * 2,
              }}
            >
              Tu perfil
            </Text>
            <TouchableOpacity
              disabled={isLoading || isSubmitting}
              style={{
                position: "absolute",
                top: Spacing * 1,
                right: -Spacing,
                zIndex: 1,
              }}
              onPress={() => navigate("DeleteUser")}
            >
              <Icon raised name="trash" type="font-awesome-5" color="black" />
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.medium,
                marginHorizontal: 5,
                maxWidth: "60%",
                alignSelf: "flex-start",
              }}
            >
              Nombre
            </Text>
            <AppTextInput
              placeholder="Nombre"
              value={capitalizeFirstLetter(newName)}
              editable={editable}
              onChangeText={setNewName}
            />
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.medium,
                marginHorizontal: 5,
                maxWidth: "60%",
                alignSelf: "flex-start",
              }}
            >
              Apellido
            </Text>
            <AppTextInput
              placeholder="Apellido"
              value={capitalizeFirstLetter(newLastName)}
              editable={editable}
              onChangeText={setNewLastName}
            />
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.medium,
                marginHorizontal: 5,
                maxWidth: "60%",
                alignSelf: "flex-start",
              }}
            >
              Correo
            </Text>
            <AppTextInput
              placeholder="Correo"
              value={newEmail.toLowerCase()}
              editable={editable}
              onChangeText={setNewEmail}
            />
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.medium,
                marginHorizontal: 5,
                maxWidth: "60%",
                alignSelf: "flex-start",
              }}
            >
              Rol
            </Text>
            <AppTextInput
              placeholder="Rol"
              value={newRole}
              editable={editable}
              onChangeText={setNewRole}
            />
          </View>

          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            onPress={handleButtonPress}
            style={{
              padding: Spacing * 1,
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
              {editable ? "Cancelar" : "Editar Datos"}
            </Text>
          </TouchableOpacity>

          {editable && (
            <TouchableOpacity
              disabled={isLoading || isSubmitting}
              onPress={handleSaveChanges}
              style={{
                padding: Spacing * 1,
                backgroundColor: isSubmitting
                  ? Colors.disabled
                  : Colors.primary,
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
                  Guardar
                </Text>
              )}
            </TouchableOpacity>
          )}

          {!editable && (
            <TouchableOpacity
              disabled={isLoading || isSubmitting}
              onPress={() => navigate("ChangePassword")}
              style={{
                padding: Spacing * 1,
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
                Cambiar Contraseña
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
