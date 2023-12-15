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
import { useMutation, useQuery } from "@apollo/client";
import { GETUSERSBYTEAMID } from "../../../graphql/queries";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Spacing from "../../../constants/Spacing";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import FontSize from "../../../constants/FontSize";
import { Icon } from "@rneui/themed";
import { CHANGECREATOR, KICKUSER } from "../../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "UserDetails">;

const UserDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userId } = useUserStore();
  const [users, setUsers] = useState([]);
  const { teamCreatorId, setTeamCreatorId } = useUserStore();
  const { teamId } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const { data: usersData, refetch: refetchUsers } = useQuery(GETUSERSBYTEAMID, {
    skip: true,
  });

  const [kickUserMutation, { data }] = useMutation(KICKUSER);

  const [changeCreator, { data: changeCreatorData }] = useMutation(CHANGECREATOR);

  useEffect(() => {
    refreshUserList();
  }, [usersData]);

  const orderUsers = (users, idCreator) => {
    const usersOrdered = [];
    users.forEach((user) => {
      if (user.id === idCreator) {
        usersOrdered.unshift(user);
      } else {
        usersOrdered.push(user);
      }
    });
    setUsers(usersOrdered);
    return;
  };

  const refreshUserList = async () => {
    refetchUsers({ id: teamId })
      .then(({ data: usersData }) => {
        orderUsers(usersData.usersByTeamId, teamCreatorId);
      })
      .catch((error) => {
        console.error("Error al cargar los usuarios:", error);
      });
  };

  const makeLeader = async (newCreatorId) => {
    setIsSubmitting(true);
    try {
      setIsLoading(true);
      const { data } = await changeCreator({
        variables: {
          idTeam: teamId,
          idUser: userId,
          idNewCreator: newCreatorId,
        },
      });
      setIsLoading(false);
      if (data && data.changeCreator) {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Nuevo líder asignado",
          position: "bottom",
          visibilityTime: 1500, // Duration in milliseconds
          autoHide: true,
        });
        navigate("Dashboard");
      }
    } catch (error) {
      setIsSubmitting(false);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    }
  };

  const kickUser = async (userId) => {
    setIsSubmitting(true);
    try {
      setIsLoading(true);
      const { data } = await kickUserMutation({
        variables: {
          idTeam: teamId,
          idUser: userId,
        },
      });
      setIsLoading(false);
      if (data && data.kickUser) {
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Usuario expulsado",
          position: "bottom",
          visibilityTime: 1500, // Duration in milliseconds
          autoHide: true,
        });
        refreshUserList();
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    }
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
            disabled={isLoading || isSubmitting}
            style={{
              position: "absolute",
              top: Spacing * 5,
              left: Spacing,
              zIndex: 1,
            }}
            onPress={() => navigate("TeamDashboard")}
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
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                  {user.id === teamCreatorId && (
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
                      marginLeft: user.id === teamCreatorId ? 5 : 0,
                    }}
                  >
                    {user.name} {user.lastName} {user.role}
                  </Text>
                </View>
                {user.id !== teamCreatorId && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '50%' }}>
                    {userId === teamCreatorId && (
                      <TouchableOpacity
                        disabled={isLoading || isSubmitting}
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
                    )}
                    {userId === teamCreatorId && (
                      <TouchableOpacity
                        disabled={isLoading || isSubmitting}
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
                    )}
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
