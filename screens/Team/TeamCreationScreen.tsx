import {
  SafeAreaView,
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
import AppTextInput from "../../components/AppTextInput";
import { useMutation, useQuery } from '@apollo/client';
import { ADDTEAM, REGISTER } from '../../graphql/mutations';
import { CREATETEAM } from '../../graphql/mutations';
import { useUserStore } from "../../stores/useUserStore";
import { GETUSERIDBYEMAIL } from "../../graphql/queries";

type Props = NativeStackScreenProps<RootStackParamList, "TeamCreation">;

const TeamCreation: React.FC<Props> = ({ navigation: { navigate } }) => {
  const {
    userEmail: initialUserEmail
  } = useUserStore();

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  
  const { data: userIdData } = useQuery(GETUSERIDBYEMAIL, {
    variables: {
      email: initialUserEmail,
    },
  });

  const [createTeam, { data }] = useMutation(CREATETEAM);

  const [addTeam, { data: addTeamData }] = useMutation(ADDTEAM);

  const handleTeamCreation = async () => {
    if (teamName === '' || teamDescription === '') {
      alert('Todos los campos deben estar llenos');
    } else {
      try {
        if (userIdData && userIdData.email.id) {
          
          const userId = userIdData.email.id;

          const { data } = await createTeam({
            variables: {
              name: teamName,
              description: teamDescription,
              idUser: userId,
            },
          });

          if (data && data.createTeam) {
            
            const teamId = data.createTeam.id;

            const { data: addTeamData } = await addTeam({
              variables: {
                idUser: userId,
                idTeam: teamId,
              },
            });

            if (addTeamData && addTeamData.addTeam) {
              alert("Equipo creado correctamente");
              navigate("Dashboard");
            }
          }
        }
      } catch (e) {
        alert("Error al registrar el equipo");
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
              marginVertical: Spacing * 3,
            }}
          >
            Crea tu equipo
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 1,
          }}
        >
          <AppTextInput placeholder="Nombre del equipo" value={teamName} onChangeText={setTeamName}/>
          <AppTextInput placeholder="Descripción del equipo." value={teamDescription} onChangeText={setTeamDescription}/>
        </View>

        <TouchableOpacity
          onPress={() => handleTeamCreation()}
          style={{
            padding: Spacing * 2,
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
            Crear Equipo
          </Text>
        </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

export default TeamCreation;
