import {
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

type Props = NativeStackScreenProps<RootStackParamList, "AddUser">;

const AddUser: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [userEmail, setEmail] = useState('');
  const { teamId, setTeamId } = useUserStore();

  const [addUsers, { data }] = useMutation(ADDUSERS);

  const { data: userIdData, error, refetch } = useQuery(GETUSERIDBYEMAIL, {
    variables: {
      email: userEmail,
    },
  });

  const handleAddUser = async () => {
    if (userEmail === '') {
      alert('Todos los campos deben estar llenos');
    } else {
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
                alert('Usuario agregado');
              })
              .catch((error) => {
                console.error(error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
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
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
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
          onPress={handleAddUser}
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.primary,
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
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddUser;
