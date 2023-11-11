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
import { useMutation } from '@apollo/client';
import { useUserStore } from "../../../stores/useUserStore";

import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "AddRoles">;

const AddRoles: React.FC<Props> = ({ navigation: { navigate } }) => {
    const [rolName, setRolName] = useState('');
    const { teamId } = useUserStore();

    /*
    const [createRole, { data }] = useMutation(CREATEROLE);

    const handleRoleCreation = async () => {
        if (rolName === '') {
            alert('Todos los campos deben estar llenos');
        } else {
            try {
                const { data } = await createRole({
                    variables: {
                        role: rolName,
                        idTeam: teamId,
                    },
                });

                if (data && data.createRole) {
                    setRolName('');
                    alert("Rol creado exitosamente");
                }
            } catch (e) {
                alert("Error al crear el rol: " + e.message);
            }
        }
    };
    */
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
                        Crea un rol para tu equipo
                    </Text>
                </View>
                <View
                    style={{
                        marginVertical: Spacing * 1,
                    }}
                >
                    <AppTextInput placeholder="Nombre del Rol" value={rolName} onChangeText={setRolName} />
                </View>

                <TouchableOpacity
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
                        Crear Equipo
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default AddRoles;
