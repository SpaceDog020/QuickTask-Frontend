import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
const { height } = Dimensions.get("window");
import { useUserStore } from '../../stores/useUserStore';
import { useQuery } from "@apollo/client";
import { GETTEAMDETAILS, GETUSERIDBYEMAIL } from "../../graphql/queries";
import { useFocusEffect } from "@react-navigation/core";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { Icon } from "@rneui/themed";
import GradientWrapper from "../../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "ViewTeams">;

const ViewTeams: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userId } = useUserStore();
  const [ teams, setTeams] = useState([]);
  const [ sortedTeams, setSortedTeams] = useState([]);
  const { teamId, setTeamId } = useUserStore();
  const { teamName, setTeamName } = useUserStore();
  const { teamDescription, setTeamDescription } = useUserStore();

  const { refetch: refetchTeams } = useQuery(GETTEAMDETAILS, {
    variables: {
      id: userId,
    },
  });

  useEffect(() => {
    refetchTeams()
      .then(({ data }) => {
        setTeams(data?.teamsByUserId || []);
        setSortedTeams(orderTeams(data?.teamsByUserId, userId));
      })
      .catch((error) => {
        console.log("Error al cargar equipos:", error);
      });
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      refetchTeams()
        .then(({ data }) => {
          setTeams(data?.teamsByUserId || []);
        })
        .catch((error) => {
          console.log("Error al cargar equipos:", error);
        });
    }, [userId])
  );

  const orderTeams = (teams, userId) => {
    return teams.sort((a, b) => {
      if (a.idCreator === userId && b.idCreator !== userId) {
        return -1;
      } else if (a.idCreator !== userId && b.idCreator === userId) {
        return 1;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
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
              onPress={() => navigate("Dashboard")}
            >
              <Icon
                raised
                size={25}
                name='arrow-back'
                type='Ionicons'
                color={Colors.primary}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: FontSize.xxLarge,
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
                textAlign: "center",
              }}
            >
              Equipos
            </Text>
          </View>
        </View>

        <ScrollView style={{ maxHeight: 600 }}>
          {teams.length === 0 ? (
            <View
              style={{
                paddingHorizontal: Spacing * 2,
                paddingTop: Spacing * 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: FontSize.large, color: Colors.primary }}>
                No hay equipos disponibles.
              </Text>
            </View>
          ) : (
            sortedTeams.map((team) => (
              <View
                key={team.id}
                style={{
                  paddingHorizontal: Spacing * 2,
                  paddingTop: Spacing * 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setTeamId(team.id);
                    setTeamName(team.name);
                    setTeamDescription(team.description);
                    navigate("TeamDashboard");
                  }}
                  style={{
                    backgroundColor: Colors.primary,
                    paddingVertical: Spacing * 1,
                    paddingHorizontal: Spacing * 2,
                    width: "100%",
                    borderRadius: Spacing,
                    shadowColor: Colors.primary,
                    shadowOffset: {
                      width: 0,
                      height: Spacing,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: Spacing,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between", // Cambiado para distribuir el contenido
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {userId === team.idCreator && (
                      <FontAwesome
                        style={{ marginRight: 8, marginBottom: 8 }}
                        name={'crown'}
                        size={20}
                        color={Colors.onPrimary}
                      />
                    )}
                    <Text
                      style={{
                        fontFamily: Font["poppins-bold"],
                        color: Colors.onPrimary,
                        fontSize: FontSize.large,
                      }}
                    >
                      {team.name}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome
                      style={{ marginRight: Spacing }}
                      name={'users'}
                      size={25}
                      color={Colors.onPrimary}
                    />
                    <Text
                      style={{
                        fontFamily: Font["poppins-bold"],
                        color: Colors.onPrimary,
                        fontSize: FontSize.medium,
                      }}
                    >
                      {team.idUsers.length}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientWrapper>
  );

};

export default ViewTeams;

const styles = StyleSheet.create({});