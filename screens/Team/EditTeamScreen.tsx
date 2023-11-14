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
import { useUserStore } from "../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import AppTextInput from "../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { UPDATETEAM } from "../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "EditTeam">;

const EditTeam: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editable, setEditable] = useState(false);
  const { teamId } = useUserStore();
  const { teamName: oldTeamName, setTeamName: setOldTeamName } = useUserStore();
  const [newTeamName, setNewTeamName] = useState(oldTeamName);
  const { teamDescription: oldTeamDescription, setTeamDescription: setOldTeamDescription } = useUserStore();
  const [newTeamDescription, setNewTeamDescription] = useState(oldTeamDescription);
  const { userId } = useUserStore();

  const [updateTeam] = useMutation(UPDATETEAM);

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
      if (newTeamName !== oldTeamName || newTeamDescription !== oldTeamDescription) {
        setNewTeamName(oldTeamName);
        setNewTeamDescription(oldTeamDescription);
      }
    }

    setEditable(!editable);

  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    if (newTeamName === "" || newTeamDescription === "") {
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
        await updateTeam({
          variables: {
            idTeam: teamId,
            idUser: userId,
            name: newTeamName,
            description: newTeamDescription,
          },
        });
        // Update the user data in your local state
        setOldTeamName(newTeamName);
        setOldTeamDescription(newTeamDescription);
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
            onPress={() => navigate("TeamDetails")}
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
            Editar Equipo
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
          <AppTextInput placeholder="Nombre" value={newTeamName} editable={editable} onChangeText={setNewTeamName} />
          <Text
            style={{
              fontFamily: Font["poppins-semiBold"],
              fontSize: FontSize.medium,
              marginHorizontal: 5,
              maxWidth: "60%",
              alignSelf: "flex-start",
            }}
          >
            Descripcion
          </Text>
          <AppTextInput placeholder="Apellido" value={newTeamDescription} editable={editable} onChangeText={setNewTeamDescription} />
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
      </View>
    </SafeAreaView>
  );

};

export default EditTeam;

const styles = StyleSheet.create({});