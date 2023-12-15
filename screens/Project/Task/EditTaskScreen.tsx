import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
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
import { DELETETASK, UPDATETASK } from "../../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";
import Modal from "react-native-modal";

type Props = NativeStackScreenProps<RootStackParamList, "EditTask">;

const EditTask: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editable, setEditable] = useState(false);
  const { taskId } = useUserStore();
  const { projectId } = useUserStore();
  const { taskName: oldTaskName, setTaskName: setOldTaskName } = useUserStore();
  const [newTaskName, setNewTaskName] = useState(oldTaskName);
  const { taskDescription: oldTaskDescription, setTaskDescription: setOldTaskDescription } = useUserStore();
  const [newTaskDescription, setNewTaskDescription] = useState(oldTaskDescription);
  const { taskIdUserResponsable: oldTaskIdUserResponsable, setTaskIdUserResponsable: setOldTaskIdUserResponsable } = useUserStore();
  const [newTaskIdUserResponsable, setNewTaskIdUserResponsable] = useState(oldTaskIdUserResponsable);
  const { taskStatus: oldTaskStatus, setTaskStatus: setOldTaskStatus } = useUserStore();
  const [newTaskStatus, setNewTaskStatus] = useState(oldTaskStatus);
  const { taskStartDate: oldTaskStartDate, setTaskStartDate: setOldTaskStartDate } = useUserStore();
  const [newTaskStartDate, setNewTaskStartDate] = useState(oldTaskStartDate);
  const { taskFinishDate: oldTaskFinishDate, setTaskFinishDate: setOldTaskFinishDate } = useUserStore();
  const [newTaskFinishDate, setNewTaskFinishDate] = useState(oldTaskFinishDate);

  const [updateTask] = useMutation(UPDATETASK);
  const [deleteTask] = useMutation(DELETETASK);

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

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
      if (newTaskName !== oldTaskName || newTaskDescription !== oldTaskDescription) {
        setNewTaskName(oldTaskName);
        setNewTaskDescription(oldTaskDescription);
      }
    }

    setEditable(!editable);
  };

  const handleDeleteTask = async () => {
    try {
      setIsLoading(true);
      // Call the updateUser mutation with the updated user data
      await deleteTask({
        variables: {
          id: taskId,
        },
      });
      // Update the user data in your local state
      setIsLoading(false);
      Toast.show({
        type: "success",
        text1: "Proyecto eliminado",
        text2: "Se ha eliminado el proyecto correctamente",
        position: "bottom",
        visibilityTime: 3000, // Duration in milliseconds
        autoHide: true,
      });
      navigate("ViewTasks");
    } catch (e) {
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
        await updateTask({
          variables: {
            id: taskId,
            idProject: projectId,
            idUser: newTaskIdUserResponsable,
            name: newTaskName,
            description: newTaskDescription,
            status: newTaskStatus,
            startDate: newTaskStartDate,
            finishDate: newTaskFinishDate,
          },
        });
        // Update the user data in your local state
        setOldTaskName(newTaskName);
        setOldTaskDescription(newTaskDescription);
        setOldTaskIdUserResponsable(newTaskIdUserResponsable);
        setOldTaskStatus(newTaskStatus);
        setOldTaskStartDate(newTaskStartDate);
        setOldTaskFinishDate(newTaskFinishDate);
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
            onPress={() => navigate("TaskDetails")}
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
            Editar Tarea
          </Text>
          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            style={{
              position: "absolute",
              top: Spacing * 1,
              right: -Spacing,
              zIndex: 1,
            }}
            onPress={() => setDeleteModalVisible(true)}
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
          <AppTextInput placeholder="Nombre" value={newTaskName} editable={editable} onChangeText={setNewTaskName} />
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
          <AppTextInput placeholder="Descripción" value={newTaskDescription} editable={editable} onChangeText={setNewTaskDescription} />
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

        <Modal
          isVisible={isDeleteModalVisible}
          onBackdropPress={() => setDeleteModalVisible(false)}
        >
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Text style={{ fontSize: 20, fontFamily: Font["poppins-bold"], marginBottom: 20 }}>
              ¿Estás seguro de que quieres eliminar esta tarea?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={{
                  backgroundColor: Colors.primary,
                  padding: Spacing * 1,
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
                <Text style={{ fontFamily: Font["poppins-bold"], color: Colors.onPrimary, fontSize: FontSize.large }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteTask}
                style={{
                  backgroundColor: Colors.error,
                  padding: Spacing * 1,
                  borderRadius: Spacing,
                  shadowColor: Colors.error,
                  shadowOffset: {
                    width: 0,
                    height: Spacing,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: Spacing,
                }}
              >
                <Text style={{ fontFamily: Font["poppins-bold"], color: Colors.onPrimary, fontSize: FontSize.large }}>
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default EditTask;
