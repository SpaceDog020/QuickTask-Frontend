import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AppTextInput from "../../components/AppTextInput";
import { useMutation, useQuery } from "@apollo/client";
import { GETTEAMS } from "../../graphql/queries";
import { CREATEPROJECT } from "../../graphql/mutations";

type Props = NativeStackScreenProps<RootStackParamList, "ProjectCreation">;

const ProjectCreation: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [idTeam, setIdTeam] = useState(null);

  const { data: teamsData } = useQuery(GETTEAMS);

  const [createProject, { data }] = useMutation(CREATEPROJECT);

  const handleProjectCreation = async () => {
    if (projectName === '' || projectDescription === '' || idTeam === null) {
      alert('Todos los campos deben estar llenos');
    } else {
      try {
        const { data } = await createProject({
          variables: {
            name: projectName,
            description: projectDescription,
            idTeam: idTeam,
          },
        });
        if (data && data.createProject) {
          alert("Projecto creado correctamente");
          navigate("Dashboard");
        }
      } catch (e) {
        alert("Error: " + e.message);
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
            Crea tu proyecto
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 1,
          }}
        >
          <AppTextInput
            placeholder="Nombre del proyecto"
            value={projectName}
            onChangeText={setProjectName}
          />
          <AppTextInput
            placeholder="Descripción del proyecto"
            value={projectDescription}
            onChangeText={setProjectDescription}
          />

          <Picker
            style={{
              fontFamily: Font["poppins-regular"],
              fontSize: FontSize.small,
              padding: Spacing * 2,
              backgroundColor: Colors.lightPrimary,
              borderRadius: Spacing,
              marginVertical: Spacing,
            }}
            selectedValue={idTeam}
            onValueChange={(itemValue, itemIndex) => setIdTeam(itemValue)}
          >
            <Picker.Item style={{ fontFamily: Font["poppins-regular"] }} label="Selecciona un equipo" value={null} />
            {teamsData?.teams.map((team) => (
              <Picker.Item key={team.id} label={team.name} value={team.id} />
            ))}
          </Picker>

        </View>

        <TouchableOpacity
          onPress={() => handleProjectCreation()}
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
            Crear Proyecto
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProjectCreation;
