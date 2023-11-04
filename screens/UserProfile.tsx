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
        if (newName !== userName || newLastName !== userLastName || newEmail !== userEmail) {
          setNewName(userName);
          setNewLastName(userLastName);
          setNewEmail(userEmail);
        }
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
          padding: Spacing * 2,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
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
          style={{
            position: "absolute",
            top: Spacing * 1,
            right: Spacing * 1,
            zIndex: 1,
          }}
            onPress={() => navigate("DeleteUserScreen")}
          >
            <Icon
              raised

              name='trash'
              type='font-awesome-5'
              color='black'/>
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
          <AppTextInput placeholder="Nombre" value={newName} editable={editable} onChangeText={setNewName}/>
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
          <AppTextInput placeholder="Apellido" value={newLastName} editable={editable} onChangeText={setNewLastName}/>
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
          <AppTextInput placeholder="Nombre" value={newEmail} editable={editable} onChangeText={setNewEmail}/>
        </View>

        <TouchableOpacity
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
            onPress={handleSaveChanges}
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
              Guardar
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
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