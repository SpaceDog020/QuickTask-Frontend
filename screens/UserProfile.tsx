import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
const { height } = Dimensions.get("window");
import { useUserStore } from "../stores/useUserStore";
import { Icon } from "@rneui/themed";
import AppTextInput from "../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { UPDATEUSER } from "../graphql/mutations";

type Props = NativeStackScreenProps<RootStackParamList, "UserProfile">;

const UserProfile: React.FC<Props> = ({ navigation: { navigate } }) => {
  const {
    userName: initialUserName,
    userLastName: initialUserLastName,
    userEmail: initialUserEmail,
  } = useUserStore();
  
  const [userName, setUserName] = useState(initialUserName);
  const [userLastName, setUserLastName] = useState(initialUserLastName);
  const [userEmail, setUserEmail] = useState(initialUserEmail);
  const [editable, setEditable] = useState(false); // Initialize the editability state
  const [updateUser] = useMutation(UPDATEUSER);
  const [newName, setNewName] = useState(userName);
  const [newLastName, setNewLastName] = useState(userLastName);
  const [newEmail, setNewEmail] = useState(userEmail);


  const handleButtonPress = () => {
    if (editable) {
        // Reset the text input values to the current user data
        setNewName(userName);
        setNewLastName(userLastName);
        setNewEmail(userEmail);
      }
    
    setEditable(!editable);

  };

  const handleSaveChanges = async () => {
    if (newName === "" || newLastName === "" || newEmail === "") {
      alert("Todos los campos deben estar llenos");
    } else {
      try {
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
        useUserStore.setState({
            userName: newName,
            userLastName: newLastName,
            userEmail: newEmail,
          });
        

        // Disable editability after saving changes
        setEditable(false);
      } catch (e) {
        alert("Error al actualizar datos, ingrese un correo válido");
      }
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          alignItems: "flex-end",
          paddingTop: 25,
          flexGrow: 1,
        }}
      >
        <TouchableOpacity>
          <Icon
            raised
            name="user"
            type="font-awesome-5"
            color="black"
            onPress={() => navigate("ChangePassword")}
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{
            fontSize: FontSize.xxLarge,
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
            textAlign: "center",
          }}
        >
          Tu Perfil
        </Text>
      </View>
      <View
        style={{
          marginVertical: Spacing * 1,
        }}
      >
        <Text style={{ paddingLeft: 20, fontSize: 18, fontWeight: "800" }}>
          Nombre
        </Text>
        <AppTextInput
          value={newName}
          editable={editable} // Set the editability based on the state
          onChangeText={setNewName} 
          // Update the state when the text changes
        />
        <Text style={{ paddingLeft: 20, fontSize: 18, fontWeight: "800" }}>
          Apellido
        </Text>
        <AppTextInput
          value={newLastName}
          editable={editable} // Set the editability based on the state
          onChangeText={setNewLastName} // Update the state when the text changes
        />
        
        <Text style={{ paddingLeft: 20, fontSize: 18, fontWeight: "800" }}>
          Email
        </Text>
        <AppTextInput
          value={newEmail}
          editable={editable}
          keyboardType="email-address" // Set the editability based on the state
          onChangeText={setNewEmail}  // Update the state when the text changes
        />

        <TouchableOpacity
          onPress={handleButtonPress}
          style={{
            marginHorizontal: 95,
            backgroundColor: Colors.primary,
            paddingVertical: Spacing * 1.5,
            paddingHorizontal: Spacing * 2,
            width: "50%",
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
              fontSize: FontSize.medium,
              textAlign: "center",
            }}
          >
            {editable ? "Cancelar" : "Editar Datos"}
          </Text>
        </TouchableOpacity>

        {editable && (
          <TouchableOpacity
            onPress={handleSaveChanges}
            style={{
              marginHorizontal: 95,
              backgroundColor: Colors.primary,
              paddingVertical: Spacing * 1.5,
              paddingHorizontal: Spacing * 2,
              width: "50%",
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
                fontSize: FontSize.medium,
                textAlign: "center",
              }}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
