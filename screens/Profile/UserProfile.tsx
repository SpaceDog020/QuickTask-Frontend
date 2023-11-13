import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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
const { height } = Dimensions.get("window");
import { useUserStore } from "../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import AppTextInput from "../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { UPDATEUSER } from "../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "UserProfile">;

const UserProfile: React.FC<Props> = ({ navigation: { navigate } }) => {
  const {
    userName: initialUserName,
    userLastName: initialUserLastName,
    userEmail: initialUserEmail,
  } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState(initialUserName);
  const [userLastName, setUserLastName] = useState(initialUserLastName);
  const [userEmail, setUserEmail] = useState(initialUserEmail);
  const [editable, setEditable] = useState(false); // Initialize the editability state
  const [updateUser] = useMutation(UPDATEUSER);
  const [newName, setNewName] = useState(userName);
  const [newLastName, setNewLastName] = useState(userLastName);
  const [newEmail, setNewEmail] = useState(userEmail);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1000,
    isSubmitting
  );

  const handleButtonPress = () => {
    if (editable) {
      // Reset the text input values to the current user data
      if (newName !== userName || newLastName !== userLastName || newEmail !== userEmail) {
        setNewName(userName);
        setNewLastName(userLastName);
        setNewEmail(userEmail);
      }
    }

    setEditable(!editable);

  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    if (newName === "" || newLastName === "" || newEmail === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        setIsLoading(true);
        // Call the updateUser mutation with the updated user data
        await updateUser({
          variables: {
            oldEmail: userEmail,
            name: newName,
            lastName: newLastName,
            email: newEmail,
          },
        });
        // Update the user data in your local state
        setUserName(newName);
        setUserLastName(newLastName);
        setUserEmail(newEmail);
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
              name='arrow-back'
              type='Ionicons'
              color={Colors.primary} />
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
            <Icon
              raised
              name='trash'
              type='font-awesome-5'
              color='black' />
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
          <AppTextInput placeholder="Nombre" value={newName} editable={editable} onChangeText={setNewName} />
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
          <AppTextInput placeholder="Apellido" value={newLastName} editable={editable} onChangeText={setNewLastName} />
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
          <AppTextInput placeholder="Nombre" value={newEmail} editable={editable} onChangeText={setNewEmail} />
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

      </View>
    </SafeAreaView>
  );

};

export default UserProfile;

const styles = StyleSheet.create({});