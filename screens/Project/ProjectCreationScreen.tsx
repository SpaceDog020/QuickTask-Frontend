import {
  ActivityIndicator,
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
import { Icon } from "@rneui/themed";
import useButtonTimeout from "../../hooks/useButtonTimeout";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "ProjectCreation">;

const ProjectCreation: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [idTeam, setIdTeam] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: teamsData, refetch: refetchTeams } = useQuery(GETTEAMS);

  const [createProject, { data }] = useMutation(CREATEPROJECT);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  useFocusEffect(() => {
    refetchTeams();
  });

  const handleProjectCreation = async () => {
    setIsSubmitting(true);
    if (projectName === '' || projectDescription === '' || idTeam === null) {
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
        const { data } = await createProject({
          variables: {
            name: projectName,
            description: projectDescription,
            idTeam: idTeam,
          },
        });
        setIsLoading(false);
        if (data && data.createProject) {
          Toast.show({
            type: "success",
            text1: "Proyecto creado exitosamente",
            text2: "Regresando al dashboard",
            position: "bottom",
            visibilityTime: 1500, // Duration in milliseconds
            autoHide: true,
          });
          navigate("Dashboard");
        }
      } catch (e) {
        setIsSubmitting(false);
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
          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            style={{
              position: "absolute",
              top: Spacing * 2,
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
              marginVertical: Spacing * 3,
              marginHorizontal: Spacing * 3,
              textAlign: "center",
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
            maxLength={20}
          />
          <AppTextInput
            placeholder="Descripción del proyecto"
            value={projectDescription}
            onChangeText={setProjectDescription}
            maxLength={30}
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
          disabled={isLoading || isSubmitting}
          style={{
            padding: Spacing * 2,
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
              Crear Proyecto
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProjectCreation;
