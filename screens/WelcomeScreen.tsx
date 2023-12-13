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
import GradientWrapper from "../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

const WelcomeScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  return (
    <GradientWrapper>
      <SafeAreaView>
        <View>
          <ImageBackground
            style={{
              height: height / 2.5,
            }}
            resizeMode="contain"
            source={require("../assets/images/welcome-img.png")}
          />
          <View
            style={{
              paddingHorizontal: Spacing * 4,
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
                fontSize: FontSize.small,
                color: Colors.text,
                fontFamily: Font["poppins-regular"],
                textAlign: "center",
                marginTop: Spacing * 2,
              }}
            >
              Tu aliado para gestionar proyectos de manera eficiente desde tu móvil
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 1,
              padding: Spacing * 2,
            }}
          >
            <TouchableOpacity
              onPress={() => navigate("Login")}
              style={{
                padding: Spacing * 2,
                backgroundColor: Colors.primary,
                marginVertical: Spacing * 3,
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
                Iniciar Sesion
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigate("Register")}
              style={{
                padding: Spacing,
              }}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: Colors.text,
                  textAlign: "center",
                  fontSize: FontSize.large,
                }}
              >
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
