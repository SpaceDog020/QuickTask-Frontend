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
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
const { height } = Dimensions.get("window");
import { useUserStore } from '../stores/useUserStore';
import { useQuery } from "@apollo/client";
import { GETTEAMDETAILS, GETUSERIDBYEMAIL } from "../graphql/mutations";
import { useFocusEffect } from "@react-navigation/core";

type Props = NativeStackScreenProps<RootStackParamList, "ViewTeams">;

const ViewTeams: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userEmail, setUserEmail } = useUserStore();
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const { data: userIdData } = useQuery(GETUSERIDBYEMAIL, {
    variables: {
      email: userEmail,
    },
  });

  const userId = userIdData?.email.id; // Asegúrate de verificar si userIdData está definido

  const { refetch: refetchTeams } = useQuery(GETTEAMDETAILS, {
    variables: {
      id: userId,
    },
  });

  useEffect(() => {
    refetchTeams()
      .then(({ data }) => {
        setTeams(data?.teamsByUserId || []);
      })
      .catch((error) => {
        console.error("Error al cargar equipos:", error);
      });
  }, [userId]);
  
  useFocusEffect(
    React.useCallback(() => {
      refetchTeams()
        .then(({ data }) => {
          setTeams(data?.teamsByUserId || []);
        })
        .catch((error) => {
          console.error("Error al cargar equipos:", error);
        });
    }, [userId])
  );
  
  const handleTeam = async ()  => {

  }

  return (
    <SafeAreaView>
      <View>
        <View
          style={{
            paddingTop: Spacing * 6,
          }}
        >
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
      
      <ScrollView style={{ maxHeight: 447 }}>
        {teams &&
          teams.map((team) => (
            <View
              key={team.id}
              style={{
                paddingHorizontal: Spacing * 2,
                paddingTop: Spacing * 2,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                onPress={() => navigate("ViewTeams")}
                style={{
                  backgroundColor: Colors.primary,
                  paddingVertical: Spacing * 1,
                  paddingHorizontal: Spacing * 2,
                  width: "100%", // Ajusta el ancho del botón al 100%
                  borderRadius: Spacing,
                  shadowColor: Colors.primary,
                  shadowOffset: {
                    width: 0,
                    height: Spacing,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: Spacing,
                  flexDirection: "row", // Añade flexDirection para alinear el texto a la izquierda
                  alignItems: "center", // Centra verticalmente el texto
                  justifyContent: "flex-start", // Alinea el texto a la izquierda
                }}
              >
                <Text
                  style={{
                    fontFamily: Font["poppins-bold"],
                    color: Colors.onPrimary,
                    fontSize: FontSize.large,
                  }}
                >
                  {team.name}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
      
      <View
        style={{
          paddingHorizontal: Spacing * 2,
          paddingTop: Spacing * 3,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => navigate("Dashboard")}
          style={{
            marginLeft: 90,
            backgroundColor: Colors.primary,
            paddingVertical: Spacing * 1.5,
            paddingHorizontal: Spacing * 2,
            width: "48%", // Ancho original del botón de volver
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

export default ViewTeams;

const styles = StyleSheet.create({});