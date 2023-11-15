import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import AppTextInput from "../../../components/AppTextInput";
import { useMutation, useQuery } from '@apollo/client';
import { ADDUSERS } from '../../../graphql/mutations';
import { useUserStore } from "../../../stores/useUserStore";
import { GETUSERIDBYEMAIL } from "../../../graphql/queries";
import { Icon } from "@rneui/themed";
import useButtonTimeout from "../../../hooks/useButtonTimeout";
import Toast from "react-native-toast-message";

type Props = NativeStackScreenProps<RootStackParamList, "AddUser">;

const AddUser: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [userEmail, setEmail] = useState('');
  const { teamId, setTeamId } = useUserStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addUsers, { data }] = useMutation(ADDUSERS);

  const { data: userIdData, error, refetch } = useQuery(GETUSERIDBYEMAIL, {
    variables: {
      email: userEmail,
    },
  });

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const handleAddUser = async () => {
    setIsSubmitting(true);
    if (userEmail === '') {
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
      refetch()
        .then(() => {
          if (userIdData && userIdData.email) {
            const idUser = userIdData.email.id;
            addUsers({
              variables: {
                idTeam: teamId,
                idUser,
              },
            })
              .then(() => {
                setIsSubmitting(false);
                setIsLoading(false);
                Toast.show({
                  type: "success",
                  text1: "Usuario agregado",
                  text2: "El usuario ha sido agregado al equipo",
                  position: "bottom",
                  visibilityTime: 1500, // Duration in milliseconds
                  autoHide: true,
                });
              })
              .catch((error) => {
                setIsSubmitting(false);
                setIsLoading(false);
                Toast.show({
                  type: "error",
                  text1: "Error",
                  text2: error.message,
                  position: "bottom",
                  visibilityTime: 3000, // Duration in milliseconds
                  autoHide: true,
                });
              });
          }
        })
        .catch((error) => {
          setIsSubmitting(false);
          setIsLoading(false);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: error.message,
            position: "bottom",
            visibilityTime: 3000, // Duration in milliseconds
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
            onPress={() => navigate("TeamDashboard")}
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
            Agregar Usuario al Equipo
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 1,
          }}
        >
          <AppTextInput placeholder="Correo" keyboardType="email-address" value={userEmail} onChangeText={setEmail} />
        </View>

        <TouchableOpacity
          disabled={isLoading || isSubmitting}
          onPress={handleAddUser}
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
              Agregar Usuario
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddUser;
