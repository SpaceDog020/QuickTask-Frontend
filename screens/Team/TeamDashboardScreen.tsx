import React, { useEffect, useState } from "react";
import { Button } from "react-native";
import {
  Dimensions,
  SafeAreaView,
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
import { useUserStore } from "../../stores/useUserStore";
import { useQuery } from "@apollo/client";
import { GETTEAMBYID } from "../../graphql/queries";
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDashboard">;

const TeamDashboard: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { teamId, setTeamId } = useUserStore();
  const { teamCreatorId, setTeamCreatorId } = useUserStore();
  const { userId, setUserId } = useUserStore();
  const [userIsCreator, setUserIsCreator] = useState(false);

  const { data: teamData, refetch: refetchTeam } = useQuery(GETTEAMBYID, {
    variables: {
      id: teamId,
    },
  });

  const checkUserIsCreator = () => {
    if (teamData && teamData.team) {
      setTeamCreatorId(teamData.team.idCreator);
      if (userId === teamData.team.idCreator) {
        setUserIsCreator(true);
        return;
      }
      setUserIsCreator(false);
      return;
    }
  };

  useEffect(() => {
    checkUserIsCreator();
    refetchTeam().catch((error) => {
      console.error("Error al cargar el equipo:", error);
    });
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
      onPress: () => navigate('AddUser'),
    },
    {
      label: 'Editar Equipo',
      icon: 'users-cog',
      onPress: () => navigate('EditTeam'),
    },
  ];

  const buttonColors = {
    'Ver Usuarios': 'blue',
    'Agregar Usuario': 'blue',
    'Editar Equipo': 'royalblue',
  };

  return (
    <GradientWrapper>
      <SafeAreaView>
        <View>
          <View
            style={{
              paddingTop: Spacing * 6,
            }}
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: Spacing * 5,
                left: Spacing,
                zIndex: 1,
              }}
              onPress={() => navigate("ViewTeams")}
            >
              <Icon
                raised
                size={25}
                name='arrow-back'
                type='Ionicons'
                color={Colors.primary} />
            </TouchableOpacity>
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: Spacing * 2 }}>
          {userIsCreator ? (
            // Si el usuario es el creador, muestra todos los botones
            [...commonButtons, ...creatorButtons].map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                style={{
                  width: 160,
                  height: 120,
                  margin: Spacing / 2,
                  backgroundColor: buttonColors[button.label],
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
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
                  size={50}
                  color={Colors.onPrimary}
                />
                <Text
                  style={{
                    color: Colors.onPrimary,
                    fontFamily: Font['poppins-bold'],
                    textAlign: 'center',
                  }}>
                  {button.label}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            // Si el usuario no es el creador, muestra solo los botones comunes
            commonButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={button.onPress}
                style={{
                  width: 160,
                  height: 120,
                  margin: Spacing / 2,
                  backgroundColor: buttonColors[button.label],
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
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
                  size={50}
                  color={Colors.onPrimary}
                />
                <Text
                  style={{
                    color: Colors.onPrimary,
                    fontFamily: Font['poppins-bold'],
                    textAlign: 'center',
                  }}>
                  {button.label}
                </Text>
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
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default TeamDashboard;

const styles = StyleSheet.create({});

function refetchTeams() {
  throw new Error("Function not implemented.");
}

