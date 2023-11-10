import {
  Dimensions,
  ImageBackground,
  Modal,
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
const { height } = Dimensions.get("window");
import { useUserStore } from "../../stores/useUserStore";
import AppTextInput from "../../components/AppTextInput";
import { Button } from "@rneui/themed";

type Props = NativeStackScreenProps<RootStackParamList, "DeleteUser">;

const DeleteUserScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userName, setUserName } = useUserStore();
  const { userLastName, setUserLastName } = useUserStore();
  const { userEmail, setUserEmail } = useUserStore();
  const { removeAccessToken } = useUserStore();
  const [isModalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState(""); // State to store the password input

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDeleteUser = () => {
    // Show the confirmation dialog
    toggleModal();
  };

  const confirmDeleteUser = () => {
    // Add your logic to delete the user's account here.
    // This can include making an API request to delete the user from the server.
    // Once the user is deleted, you can navigate to another screen, such as the login screen.
    // For demonstration purposes, we'll navigate back to the UserProfile screen.
    // You should replace this with your actual logic to delete the user.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Eliminar Cuenta de Usuario</Text>
      <Text style={styles.description}>
        ¿Estás seguro de que deseas eliminar tu cuenta de usuario?
      </Text>
      {/* Password input */}
      <AppTextInput
        placeholder="Contraseña"
        secureTextEntry={true} // Secure text entry for password
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity onPress={handleDeleteUser} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Eliminar Cuenta</Text>
      </TouchableOpacity>

      

      {/* Confirmation Dialog */}
        <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Confirmar Eliminación</Text>
          <Text style={styles.modalDescription}>
            ¿Estás seguro de que deseas eliminar tu cuenta de usuario?
          </Text>
          <Button title="Cancelar" onPress={toggleModal} />
          <Button title="Eliminar" onPress={confirmDeleteUser} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing * 2,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xLarge,
    fontWeight: "bold",
    marginBottom: Spacing,
  },
  description: {
    fontSize: FontSize.medium,
    textAlign: "center",
    marginBottom: Spacing * 2,
  },
  deleteButton: {
    backgroundColor: "red", // Use your desired color here
    padding: Spacing,
    borderRadius: Spacing / 2,
  },
  buttonText: {
    color: "white", // Use your desired color here
    fontSize: FontSize.medium,
    fontWeight: "bold",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: Spacing * 2,
    borderRadius: Spacing / 2,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: FontSize.large,
    fontWeight: "bold",
    marginBottom: Spacing,
  },
  modalDescription: {
    fontSize: FontSize.medium,
    textAlign: "center",
    marginBottom: Spacing * 2,
  },
});

export default DeleteUserScreen;
