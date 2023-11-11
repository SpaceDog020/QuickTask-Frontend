import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useUserStore } from '../../../stores/useUserStore';
import { useQuery } from "@apollo/client";
import { GETTEAMBYID, GETUSERSBYIDS } from "../../../graphql/queries";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Spacing from "../../../constants/Spacing";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import FontSize from "../../../constants/FontSize";

type Props = NativeStackScreenProps<RootStackParamList, "UserDetails">;

const UserDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
    const [users, setUsers] = useState([]);
    const { teamId } = useUserStore();

    const { data: teamData } = useQuery(GETTEAMBYID, {
      variables: {
        id: teamId,
      },
    });

    const { data: usersData, refetch: refetchUsers } = useQuery(GETUSERSBYIDS, {
        skip: true,
      });
  
    useEffect(() => {
      if (teamData && teamData.team) {
        const ids = teamData.team.idUsers;
        refetchUsers({ ids })
        .then(({ data: usersData }) => {
            setUsers(usersData?.usersByIds || []);
          })
          .catch((error) => {
            console.error("Error al cargar equipos:", error);
          });;
      }
    }, [teamData, usersData]);
  
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
          {users &&
            users.map((user) => (
              <View
                key={user.id}
                style={{
                  paddingHorizontal: Spacing * 2,
                  paddingTop: Spacing * 2,
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigate("Dashboard");
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
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: Font["poppins-bold"],
                      color: Colors.onPrimary,
                      fontSize: FontSize.large,
                    }}
                  >
                    {user.name} {user.lastName}
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
            onPress={() => navigate("TeamDetails")}
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
  
  export default UserDetails;