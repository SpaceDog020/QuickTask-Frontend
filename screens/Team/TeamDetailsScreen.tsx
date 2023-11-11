import React, { useEffect, useState } from "react";
import { Button } from "react-native";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
const { height } = Dimensions.get("window");
import { useUserStore } from "../../stores/useUserStore";
import { useQuery } from "@apollo/client";
import { GETTEAMBYID } from "../../graphql/queries";
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from "@react-navigation/native";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetails">;

const TeamDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { teamId, setTeamId } = useUserStore();
  const { userId, setUserId } = useUserStore();
  const [userIsCreator, setUserIsCreator] = useState(false);

  const { data: teamData, refetch: refetchTeam } = useQuery(GETTEAMBYID, {
    variables: {
      id: teamId,
    },
  });

  const checkUserIsCreator = () => {
    if (teamData && teamData.team) {
      if (userId === teamData.team.idCreator) {
        setUserIsCreator(true);
      }
    }
  };

  useEffect(() => {
    checkUserIsCreator();
  }, [userId, teamData]);
  
  useFocusEffect(
    React.useCallback(() => {
      checkUserIsCreator();
      refetchTeam().catch((error) => {
        console.error("Error al cargar el equipo:", error);
      });
    }, [userId, teamData])
  );

  const commonButtons = [
    {
      label: 'Ver Tareas',
      icon: 'tasks',
      onPress: () => navigate('Dashboard'),
    },
    {
      label: 'Agregar Tarea',
      icon: 'calendar-plus',
      onPress: () => navigate('Dashboard'),
    },
    {
      label: 'Ver Usuarios',
      icon: 'users',
      onPress: () => navigate('UserDetails'),
    },
  ];

  // Definir los botones adicionales si el usuario es el creador del equipo
  const creatorButtons = [
    {
      label: 'Agregar Usuario',
      icon: 'user-plus',
      onPress: () => navigate('Dashboard'),
    },
    {
      label: 'Ver Roles',
      icon: 'tags',
      onPress: () => navigate('Dashboard'),
    },
    {
      label: 'Agregar Rol',
      icon: 'plus-circle',
      onPress: () => navigate('AddRoles'),
    },
    {
      label: 'Editar Equipo',
      icon: 'users-cog',
      onPress: () => navigate('Dashboard'),
    },
  ];

  return (
    <SafeAreaView>
      <View>
        <View
          style={{
            paddingTop: Spacing * 6,
          }}
        >
          {teamData && teamData.team ? (
            <>
              <Text
                style={{
                  fontSize: FontSize.xxLarge,
                  color: Colors.primary,
                  fontFamily: Font["poppins-bold"],
                  textAlign: "center",
                }}
              >
                {teamData.team.name}
              </Text>

              <Text
                style={{
                  fontSize: FontSize.large,
                  fontFamily: Font["poppins-bold"],
                  textAlign: "center",
                }}
              >
                {teamData.team.description}
              </Text>
            </>
          ) : (
            <Text style={{ textAlign: "center" }}>Cargando información del equipo...</Text>
          )}
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: Spacing * 4, }}>
        {userIsCreator ? (
          // Si el usuario es el creador, muestra todos los botones
          [...commonButtons, ...creatorButtons].map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={button.onPress}
              style={{
                margin: Spacing / 2,
                backgroundColor: Colors.primary,
                padding: Spacing * 1.5,
                borderRadius: 10,
                shadowColor: Colors.primary,
                shadowOffset: {
                  width: 0,
                  height: Spacing,
                },
                shadowOpacity: 0.3,
                shadowRadius: Spacing,
              }}>
              <FontAwesome
                name={button.icon}
                size={30}
                color={Colors.onPrimary}
              />
            </TouchableOpacity>
          ))
        ) : (
          // Si el usuario no es el creador, muestra solo los botones comunes
          commonButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              onPress={button.onPress}
              style={{
                margin: Spacing / 2,
                backgroundColor: Colors.primary,
                padding: Spacing * 1.5,
                borderRadius: 10,
                shadowColor: Colors.primary,
                shadowOffset: {
                  width: 0,
                  height: Spacing,
                },
                shadowOpacity: 0.3,
                shadowRadius: Spacing,
              }}>
              <FontAwesome
                name={button.icon}
                size={30}
                color={Colors.onPrimary}
              />
            </TouchableOpacity>
          ))
        )}
      </View>
      <View
        style={{
          paddingHorizontal: Spacing * 2,
          paddingTop: Spacing * 3,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => navigate("ViewTeams")}
          style={{
            marginLeft: 90,
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
              fontSize: FontSize.large,
              textAlign: "center",
            }}
          >
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TeamDetails;

const styles = StyleSheet.create({});

function refetchTeams() {
  throw new Error("Function not implemented.");
}

