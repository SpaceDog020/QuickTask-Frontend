import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
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
import { GETTEAMBYID} from "../graphql/queries";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATETEAM } from "../graphql/mutations";

type Props = NativeStackScreenProps<RootStackParamList, "EditTeamScreen">;

const EditTeamScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { teamId, setTeamId } = useUserStore();
  const { userId, setUserId } = useUserStore();
  const [editable, setEditable] = useState(false); // Initialize the editability state
  const [updateTeam, {data}]= useMutation(UPDATETEAM);

  const { data: teamData } = useQuery(GETTEAMBYID, {
    variables: {
      id: teamId,
    },
  });
  
  const [ teamName, setTeamName ]  = useState(teamData.team.name);
  const [ teamDescription, setTeamDescription ] = useState(teamData.team.description);
  
  const [newTeamName, setNewTeamName] = useState(teamName);
  const [newTeamDescription, setNewTeamDescription] = useState(teamDescription);

  const handleButtonPress = () => {
    if (editable) {
        // Reset the text input values to the current user data
        if ( newTeamName !== teamName || newTeamDescription !== teamDescription) {
            setNewTeamName(teamName);
            setNewTeamDescription(teamDescription);
        }
      }
    
    setEditable(!editable);

  };

  const handleSaveChanges = async () => {
    if (newTeamName === "" || newTeamDescription === "") {
      alert("Todos los campos deben estar llenos");
    } else {
      try {
        // Call the updateUser mutation with the updated user data
        
        const { data } = await updateTeam({
            variables: {
                idTeam: teamId,
                idUser: userId,
                name: newTeamName,
                Description: newTeamDescription,
            },
        });
        
        console.log(data.updateTeam.response);
        // Update the user data in your local state
        setTeamName(newTeamName);
        setTeamDescription(newTeamDescription);
        

        // Disable editability after saving changes
        setEditable(false);
      } catch (e) {
        alert("Error al actualizar datos del equipo");
      }
    }
  };


  

  return (
    <SafeAreaView>
      <View>
        <Text
          style={{
            paddingTop: Spacing * 4,
            fontSize: FontSize.xxLarge,
            color: Colors.primary,
            fontFamily: Font["poppins-bold"],
            textAlign: "center",
          }}
        >
          Tu Perfil
        </Text>
        {/* Add the trash icon to navigate to DeleteUserScreen */}
        <TouchableOpacity
          style={{
            position: "absolute",
            top: Spacing * 4,
            right: Spacing * 2,
            zIndex: 1,
          }}
          onPress={() => navigate("DeleteUserScreen")}
        >
          {/* Use the icon for a trash bin */}
          <Icon raised name="trash" type="font-awesome-5" color="black" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginVertical: Spacing * 1,
        }}
      >
        <Text style={{ paddingLeft: 20, fontSize: 18, fontWeight: "800" }}>
          Nombre del Equipo
        </Text>
        <AppTextInput
          value={teamName}
          editable={editable} // Set the editability based on the state
          onChangeText={setTeamName}
          // Update the state when the text changes
        />
        <Text style={{ paddingLeft: 20, fontSize: 18, fontWeight: "800" }}>
          Descripción del Equipo
        </Text>
        <AppTextInput
          value={teamDescription}
          editable={editable} // Set the editability based on the state
          onChangeText={setTeamDescription} // Update the state when the text changes
        />

        
        <TouchableOpacity
          onPress={handleButtonPress}
          style={{
            marginHorizontal: 95,
            backgroundColor: Colors.primary,
            paddingVertical: Spacing * 1.5,
            paddingHorizontal: Spacing * 2,
            width: "48%",
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
      </View>
      <View>
        {editable && (
          <TouchableOpacity
            onPress={handleSaveChanges}
            style={{
              marginBottom: 10,
              marginHorizontal: 95,
              backgroundColor: Colors.primary,
              paddingVertical: Spacing * 1.5,
              paddingHorizontal: Spacing * 2,
              width: "48%",
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

export default EditTeamScreen;

const styles = StyleSheet.create({});
