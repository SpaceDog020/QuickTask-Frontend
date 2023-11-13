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
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Spacing from "../../../constants/Spacing";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import FontSize from "../../../constants/FontSize";
import { Icon } from "@rneui/themed";

type Props = NativeStackScreenProps<RootStackParamList, "UserDetails">;

const UserDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [users, setUsers] = useState([]);
  const [idCreator, setIdCreator] = useState();
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
      setIdCreator(teamData.team.idCreator);
      const ids = teamData.team.idUsers;
      refetchUsers({ ids })
        .then(({ data: usersData }) => {
          setUsers(usersData?.usersByIds || []);
        })
        .catch((error) => {
          console.error("Error al cargar equipos:", error);
        });
    }
  }, [teamData, usersData, idCreator]);

  const makeLeader = (userId) => {
    // Lógica para nombrar a un usuario líder
    // Puedes agregar tu lógica aquí
  };

  const kickUser = (userId) => {
    // Lógica para expulsar a un usuario
    // Puedes agregar tu lógica aquí
  };

  return (
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
            onPress={() => navigate("TeamDetails")}
          >
            <Icon
              raised
              size={25}
              name='arrow-back'
              type='Ionicons'
              color={Colors.primary} // Utiliza tu color primario
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FontSize.xxLarge,
              color: Colors.primary, // Utiliza tu color primario
              fontFamily: Font["poppins-bold"],
              textAlign: "center",
            }}
          >
            Usuarios
          </Text>
        </View>
      </View>

      <ScrollView style={{ maxHeight: 600 }}>
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
                disabled={true}
                style={{
                  backgroundColor: Colors.primary, // Utiliza tu color primario
                  paddingVertical: Spacing * 1,
                  paddingHorizontal: Spacing * 2,
                  width: "100%",
                  borderRadius: Spacing,
                  shadowColor: Colors.primary, // Utiliza tu color primario
                  shadowOffset: {
                    width: 0,
                    height: Spacing,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: Spacing,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {user.id === idCreator && (
                  <FontAwesome
                    style={{ marginRight: 5, marginBottom: 8 }}
                    name={'crown'}
                    size={20}
                    color={Colors.onPrimary} // Utiliza tu color para texto en el fondo primario
                  />
                )}
                <Text
                  style={{
                    fontFamily: Font["poppins-bold"],
                    color: Colors.onPrimary, // Utiliza tu color para texto en el fondo primario
                    fontSize: FontSize.large,
                  }}
                >
                  {user.name} {user.lastName}
                </Text>
                {user.id !== idCreator && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '50%' }}>
                    <TouchableOpacity
                      onPress={() => makeLeader(user.id)}
                      style={{
                        backgroundColor: Colors.primaryToast,
                        paddingVertical: Spacing * 1,
                        paddingHorizontal: Spacing * 2,
                        borderRadius: Spacing,
                        shadowColor: Colors.primaryToast,
                        shadowOffset: {
                          width: 0,
                          height: Spacing,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: Spacing,
                      }}
                    >
                      <FontAwesome
                        name={'crown'}
                        size={20}
                        color={Colors.onPrimaryToast}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => kickUser(user.id)}
                      style={{
                        backgroundColor: Colors.error,
                        paddingVertical: Spacing * 1,
                        paddingHorizontal: Spacing * 2,
                        borderRadius: Spacing,
                        shadowColor: Colors.error,
                        shadowOffset: {
                          width: 0,
                          height: Spacing,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: Spacing,
                        marginLeft: Spacing,
                      }}
                    >
                      <FontAwesome
                        name={'user-minus'}
                        size={20}
                        color={Colors.onPrimaryToast}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetails;
