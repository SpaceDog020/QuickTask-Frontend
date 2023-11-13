import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import AppTextInput from "../../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { CREATETEAM } from "../../graphql/mutations";
import { useUserStore } from "../../stores/useUserStore";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";

type Props = NativeStackScreenProps<RootStackParamList, "TeamCreation">;

const TeamCreation: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userId } = useUserStore();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createTeam, { data }] = useMutation(CREATETEAM);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const handleTeamCreation = async () => {
    setIsSubmitting(true);
    if (teamName === "" || teamDescription === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        setIsLoading(true);
        const { data } = await createTeam({
          variables: {
            name: teamName,
            description: teamDescription,
            idUser: userId,
          },
        });
        setIsLoading(false);
        if (data && data.createTeam) {
          Toast.show({
            type: "success",
            text1: "El equipo ha sido creado",
            text2: "Regresando al dashboard",
            position: "bottom",
            visibilityTime: 1500, // Duration in milliseconds
            autoHide: true,
          });
          navigate("Dashboard");
        }
      } catch (e) {
        setIsSubmitting(false);
        setIsLoading(false);
        if (e.message.includes("team already")) {
          Toast.show({
            type: "error",
            text1: "El equipo ya existe",
            text2: "Intente nuevamente",
            position: "bottom",
            visibilityTime: 3000, // Duration in milliseconds
            autoHide: true,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: e.message,
            position: "bottom",
            visibilityTime: 3000, // Duration in milliseconds
            autoHide: true,
          });
        }
      }
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
          style={{
            position: "absolute",
            top: Spacing * 2,
            left: -Spacing,
            zIndex: 1,
          }}
            onPress={() => navigate("Dashboard")}
          >
            <Icon
              raised
              size={25}
              name='arrow-back'
              type='Ionicons'
              color={Colors.primary}/>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
            }}
          >
            Crea tu equipo
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 1,
          }}
        >
          <AppTextInput
            placeholder="Nombre del equipo"
            value={teamName}
            onChangeText={setTeamName}
          />
          <AppTextInput
            placeholder="Descripción del equipo."
            value={teamDescription}
            onChangeText={setTeamDescription}
          />
        </View>

        <TouchableOpacity
          onPress={() => handleTeamCreation()}
          disabled={isLoading || isSubmitting}
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
            Crear Equipo
          </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TeamCreation;
