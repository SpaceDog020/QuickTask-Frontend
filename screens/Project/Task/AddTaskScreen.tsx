import {
    ActivityIndicator,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import Spacing from "../../../constants/Spacing";
  import FontSize from "../../../constants/FontSize";
  import Colors from "../../../constants/Colors";
  import Font from "../../../constants/Font";
  import { NativeStackScreenProps } from "@react-navigation/native-stack";
  import { RootStackParamList } from "../../../types";
  import { useMutation, useQuery } from '@apollo/client';
  import { ADDTEAMPROJECT } from '../../../graphql/mutations';
  import { useUserStore } from "../../../stores/useUserStore";
  import { GETTEAMS } from "../../../graphql/queries";
  import { Icon } from "@rneui/themed";
  import useButtonTimeout from "../../../hooks/useButtonTimeout";
  import Toast from "react-native-toast-message";
  import { Picker } from "@react-native-picker/picker";
  import { useFocusEffect } from "@react-navigation/native";
  
  type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;
  
  const AddTask: React.FC<Props> = ({ navigation: { navigate } }) => {
    const { projectId } = useUserStore();
    const { projectTeamsIds, setProjectTeamsIds } = useUserStore();
    const [idTeam, setIdTeam] = useState(null);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [rerender, setRerender] = useState(false);
  
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const { data: teamsData, refetch: refetchTeams } = useQuery(GETTEAMS);
  
    const [addTeam, { data }] = useMutation(ADDTEAMPROJECT);
  
    useButtonTimeout(
      () => {
        setIsSubmitting(false);
      },
      1500,
      isSubmitting
    );
  
    const refetchTeamsData = async () => {
      await refetchTeams();
      const filteredTeams = teamsData?.teams.filter((team) => !projectTeamsIds.includes(team.id));
      setFilteredTeams(filteredTeams);
    };
  
    useEffect(() => {
      refetchTeamsData();
    }, [rerender, teamsData, projectTeamsIds]);
  
    const handleAddTeam = async () => {
      setIsSubmitting(true);
      if (idTeam === null) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Todos los campos deben estar llenos",
          position: "bottom",
          visibilityTime: 1500, // Duration in milliseconds
          autoHide: true,
        });
      } else {
        setIsLoading(true);
        await addTeam({
          variables: {
            idProject: projectId,
            idTeam: idTeam
          },
        }).then(() => {
          setIsLoading(false);
          Toast.show({
            type: "success",
            text1: "Éxito",
            text2: "Equipo agregado exitosamente",
            position: "bottom",
            visibilityTime: 1500, // Duration in milliseconds
            autoHide: true,
          });
          setProjectTeamsIds([...projectTeamsIds, idTeam]);
          setIdTeam(null);
          refetchTeamsData();
          setRerender(prevState => !prevState);
          setIsSubmitting(false);
        }).catch((error) => {
          setIsLoading(false);
          setIsSubmitting(false);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message,
            position: "bottom",
            visibilityTime: 1500, // Duration in milliseconds
            autoHide: true,
          });
        });
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
              onPress={() => navigate("ProjectDashboard")}
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
                marginHorizontal: Spacing * 5,
                textAlign: "center",
              }}
            >
              Agregar Equipo al Proyecto
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 1,
            }}
          >
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
              {filteredTeams?.map((team) => (
                <Picker.Item key={team.id} label={team.name} value={team.id} />
              ))}
            </Picker>
          </View>
  
          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            onPress={handleAddTeam}
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
                Agregar Equipo
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  
  export default AddTask;
  