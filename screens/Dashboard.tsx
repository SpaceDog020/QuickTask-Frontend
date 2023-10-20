import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
const { height } = Dimensions.get("window");
import { useUserStore } from "../stores/useUserStore";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;


const Dashboard: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userName, setUserName } = useUserStore();
  const { userLastName, setUserLastName } = useUserStore();
  const { userEmail, setUserEmail } = useUserStore();
  const { removeAccessToken } = useUserStore();
  const { userId, setUserId } = useUserStore();


  const logout = async ()  => {
    await removeAccessToken()
    setUserName('')
    setUserLastName('')
    setUserEmail('')
    setUserId(-1)
    navigate("Welcome")
  }
  
  return (
    <SafeAreaView>
      <View>
        <View
          style={{
            paddingHorizontal: Spacing * 4,
            paddingTop: Spacing * 4,
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
            Bienvenido 
          </Text>
          <Text
          style={{
            fontSize: FontSize.large,
            fontFamily: Font["poppins-bold"],
            textAlign: "center",
          }}>
            {userName}
          </Text>
        </View>
      </View>
      <View
          style={{
            paddingHorizontal: Spacing * 2,
            paddingTop: Spacing * 6,
            flexDirection: "row",
          }}
        >
          <TouchableOpacity
            onPress={() => navigate("UserProfile")}
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
              Tu Perfil
            </Text>
          </TouchableOpacity>
      </View>
      <View
        style={{
          paddingHorizontal: Spacing * 2,
          paddingTop: Spacing * 6,
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
            Ver Equipos
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingHorizontal: Spacing * 2,
          paddingTop: Spacing * 6,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => navigate("TeamCreationScreen")}
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
            Crear Equipo
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          paddingHorizontal: Spacing * 2,
          paddingTop: Spacing * 6,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => logout()}
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
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});