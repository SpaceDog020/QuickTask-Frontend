import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useUserStore } from "../../../stores/useUserStore";
import { Icon } from "@rneui/themed";
import AppTextInput from "../../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { UPDATEUSER } from "../../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "TaskDetails">;

const capitalizeFirstLetter = (str: string) => {
  const lowercasedStr = str.toLowerCase();
  return lowercasedStr.charAt(0).toUpperCase() + lowercasedStr.slice(1);
};

const TaskDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  const {taskId} = useUserStore();
  const {taskIdCreator} = useUserStore();
  const { taskName: initialTaskName , setTaskName: setInitialTaskName} = useUserStore();
  const { taskDescription: initialTaskDescription, setTaskDescription: setInitialTaskDescription } = useUserStore();
  const { taskIdUserResponsable: initialIdUserInCharge, setTaskIdUserResponsable: setInitialIdUserInCharge } = useUserStore();

  
  const [taskName, setTaskName] = useState(initialTaskName);
  const [taskDescription, setTaskDescription] = useState(initialTaskDescription);
  const [taskIdUserResponsable, setTaskIdUserResponsable] = useState(initialIdUserInCharge);

  const [newTaskName, setNewTaskName] = useState(taskName);
  const [newTaskDescription, setNewTaskDescription] = useState(taskDescription);
  const [newTaskIdUserResponsable, setNewTaskIdUserResponsable] = useState(taskIdUserResponsable);
  //const [updateTask] = useMutation(UPDATETASK);

  

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1000,
    isSubmitting
  );

  const handleButtonPress = () => {
    if (editable) {
      // Reset the text input values to the current task data
      if (newTaskName !== taskName || newTaskDescription !== taskDescription || newTaskIdUserResponsable !== taskIdUserResponsable) {
        setNewTaskName(taskName);
        setNewTaskDescription(taskDescription);
        setNewTaskIdUserResponsable(taskIdUserResponsable);

      }
    }

    setEditable(!editable);
    
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    if (newTaskName === "" || newTaskDescription === "") {
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
        
        // Update the user data in your local state
        setTaskName(newTaskName);
        setTaskDescription(newTaskDescription);
        setTaskIdUserResponsable(newTaskIdUserResponsable);

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
          <AppTextInput placeholder="Nombre" value={capitalizeFirstLetter(newTaskName)} editable={editable} onChangeText={setTaskName} />
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
          <AppTextInput placeholder="Descripción" value={capitalizeFirstLetter(newTaskDescription)} editable={editable} onChangeText={setNewTaskDescription} />
          
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

export default TaskDetails;

const styles = StyleSheet.create({});