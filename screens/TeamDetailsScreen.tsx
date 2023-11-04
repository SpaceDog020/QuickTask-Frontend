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
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
const { height } = Dimensions.get("window");
import { useUserStore } from "../stores/useUserStore";
import { useQuery } from "@apollo/client";
import { GETTEAMBYID } from "../graphql/queries";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetails">;

const TeamDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { teamId, setTeamId } = useUserStore();
  const { userId, setUserId } = useUserStore();
  const [validateUser, setValidateUser] = useState(false);
  const [showAddUserButton, setShowAddUserButton] = useState(false);

  const { data: teamData } = useQuery(GETTEAMBYID, {
    variables: {
      id: teamId,
    },
  });

  useEffect(() => {
    if (teamData && teamData.team) {
      if (teamData.team.idCreator === userId) {
        setValidateUser(true);
        setShowAddUserButton(true);
      }
    }
  }, [teamData, userId]);

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

