import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
import React, { useState } from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import AppTextInput from "../components/AppTextInput";
import { useMutation } from "@apollo/client";
import { VALIDATERECOVERY } from "../graphql/mutations";
import { useUserStore } from '../stores/useUserStore';
  
  type Props = NativeStackScreenProps<RootStackParamList, "PassVal">;
  
  const PassValScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
    const [code, setCode] = useState('');
    const { recoveryPass, setRecoveryPass } = useUserStore();

    const [validateRecovery, { data, loading }] = useMutation(VALIDATERECOVERY);

    const handleValidation = async (code: string) => {
      if(code === ''){
        alert('Todos los campos deben estar llenos');
      }else{
        try{
          const aux = parseInt(code);
          const { data } = await validateRecovery({
            variables: {
              recoveryPass: aux,
            },
          });
          if (data && data.validateRecovery) {
            setRecoveryPass(aux);
            navigate("ChangePass");
          }
        }catch(e){
          alert("Codigo incorrecto");
          console.log(e);
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
            <Text
              style={{
                fontSize: FontSize.xLarge,
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
                marginVertical: Spacing * 3,
                textAlign: "center"
              }}
            >
              Validar Codigo
            </Text>
            <Text
              style={{
                fontFamily: Font["poppins-semiBold"],
                fontSize: FontSize.large,
                maxWidth: "60%",
                textAlign: "center",
              }}
            >
              Si el correo es correcto, recibira un codigo de verificacion
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 3,
            }}
          >
            <AppTextInput placeholder="Codigo" keyboardType="number-pad" value={code} onChangeText={setCode}/>
          </View>
  
          <TouchableOpacity
            onPress={() => handleValidation(code)}
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
                textAlign: "center",
                fontSize: FontSize.large,
              }}
            >
              Cambiar contraseña
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("Login")}
            style={{
              padding: Spacing,
            }}
          >
            <Text
              style={{
                fontFamily: Font["poppins-bold"],
                color: Colors.text,
                textAlign: "center",
                fontSize: FontSize.medium,
              }}
            >
              Volver
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  
  export default PassValScreen;
  
  const styles = StyleSheet.create({});