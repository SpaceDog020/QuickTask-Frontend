import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  const handleDeleteUser = async () => {
    if (password === "" || repeatPassword === "") {
      alert("Todos los campos deben estar llenos");
    } else if (password !== repeatPassword) {
      alert("Las contraseñas no coinciden");
    } else {
      if(userIsCreator){
        alert("No puedes eliminar tu cuenta porque eres creador de un equipo");
        return;
      }else{
        try {
          const { data } = await deleteUser({
            variables: {
              idUser: userId,
              password: password,
            },
          });
          if (data && data.deleteUser) {
            alert("Usuario eliminado correctamente");
            logout();
          }
        }
        catch (e) {
          alert("Error: " + e.message);
          console.log(e);
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

      <TouchableOpacity style={styles.button} onPress={handleDeleteUser}>
        <Text style={styles.buttonText}>Eliminar Usuario</Text>
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