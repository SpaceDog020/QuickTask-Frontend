import React, { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppTextInput from "../../components/AppTextInput";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import FontSize from "../../constants/FontSize";
import Spacing from "../../constants/Spacing";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { DELETEUSER } from "../../graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useUserStore } from "../../stores/useUserStore";
import { FINDTEAMSBYCREATORID } from "../../graphql/queries";
import { useFocusEffect } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import useButtonTimeout from "../../hooks/useButtonTimeout";
import Toast from "react-native-toast-message";


type Props = NativeStackScreenProps<RootStackParamList, "DeleteUser">;

const DeleteUser: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [userIsCreator, setUserIsCreator] = useState(false);
  const { userId, setUserId } = useUserStore();
  const { removeAccessToken } = useUserStore();
  const { userName, setUserName } = useUserStore();
  const { userLastName, setUserLastName } = useUserStore();
  const { userEmail, setUserEmail } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [deleteUser] = useMutation(DELETEUSER);

  const { data: creatorData, refetch: refetchCreator } = useQuery(FINDTEAMSBYCREATORID, {
    variables: {
      id: userId,
    },
  });

  const checkUserIsCreator = () => {
    if (creatorData && creatorData.findTeamsByCreatorId) {{
      setUserIsCreator(creatorData.findTeamsByCreatorId.response);
    }};
  };

  useEffect(() => {
    checkUserIsCreator();
  }, [userId, creatorData]);
  
  useFocusEffect(
    React.useCallback(() => {
      checkUserIsCreator();
      refetchCreator().catch((error) => {
        console.error("Error al cargar CreatorData:", error);
      });
    }, [userId, creatorData])
  );
  
  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    if (password === "" || repeatPassword === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else if (password !== repeatPassword) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Las contraseñas no coinciden",
        position: "bottom",
        visibilityTime: 2000, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      if(userIsCreator){
        Toast.show({
        type: "error",
        text1: "Error",
        text2: "No puedes eliminar tu cuenta porque eres creador de un equipo",
        position: "bottom",
        visibilityTime: 2000, // Duration in milliseconds
        autoHide: true,
      });
      }else{
        try {
          setIsLoading(true);
          const { data } = await deleteUser({
            variables: {
              idUser: userId,
              password: password,
            },
          });
          setIsLoading(false);
          if (data && data.deleteUser) {
            Toast.show({
              type: "success",
              text1: "Usuario eliminado correctamente",
              text2: "Volviendo a pantalla de bienvenida",
              position: "bottom",
              visibilityTime: 3000, // Duration in milliseconds
              autoHide: true,
            });
            logout();
          }
        }
        catch (e) {
          setIsSubmitting(false);
          setIsLoading(false);
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

  const logout = async () => {
    await removeAccessToken();
    setUserName('');
    setUserLastName('');
    setUserEmail('');
    setUserId(-1);
    navigate('Welcome');
  };

return (
  <SafeAreaView>
    <View style={styles.container}>
    <TouchableOpacity
          style={{
            position: "absolute",
            top: Spacing * 3.8,
            left: Spacing * 0.3,
            zIndex: 1,
          }}
            onPress={() => navigate("UserProfile")}
          >
            <Icon
              raised
              size={25}
              name='arrow-back'
              type='Ionicons'
              color={Colors.primary}/>
          </TouchableOpacity>
      <Text style={styles.title}>Eliminar Usuario</Text>

      <Text
        style={{
          fontFamily: Font["poppins-semiBold"],
          fontSize: FontSize.large,
          textAlign: "center",
          marginVertical: Spacing * 3,
        }}
      >
        ¿Estás seguro de que deseas eliminar tu cuenta de usuario?
      </Text>

      <AppTextInput
        placeholder="Contraseña actual"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <AppTextInput
        placeholder="Repita la contraseña"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
      />

      <TouchableOpacity style={[
            styles.button,
            {
              backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
            },
          ]}
          onPress={handleDeleteUser} disabled={isLoading || isSubmitting}>
        {isLoading || isSubmitting ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <Text style={styles.buttonText}>Eliminar Usuario</Text>
          )}
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing * 2,
  },
  title: {
    fontSize: FontSize.xLarge,
    color: Colors.primary,
    fontFamily: Font["poppins-bold"],
    marginVertical: Spacing * 3,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing * 2,
    marginVertical: Spacing * 7,
    borderRadius: Spacing,
  },
  buttonText: {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },
});

export default DeleteUser;