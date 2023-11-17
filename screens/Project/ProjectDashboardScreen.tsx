import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { useUserStore } from "../../stores/useUserStore";
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { Icon } from "@rneui/themed";

type Props = NativeStackScreenProps<RootStackParamList, "ProjectDashboard">;

const ProjectDashboard: React.FC<Props> = ({ navigation: { navigate } }) => {
    const { projectName, setProjectName } = useUserStore();
    const { projectDescription, setProjectDescription } = useUserStore();

    const Buttons = [
        {
            label: 'Ver Equipos',
            icon: 'users',
            onPress: () => navigate('TeamDetails'),
        },
        {
            label: 'Agregar Equipos',
            icon: 'user-plus',
            onPress: () => navigate('AddTeam'),
        },
        {
            label: 'Ver Backlog',
            icon: 'stream',
            onPress: () => navigate('Dashboard'),
        },
        {
            label: 'Editar Proyecto',
            icon: 'sliders-h',
            onPress: () => navigate('EditProject'),
        },
    ];

    const buttonColors = {
        'Ver Equipos': 'blue',
        'Agregar Equipos': 'blue',
        'Ver Backlog': 'royalblue',
        'Editar Proyecto': 'royalblue',
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
                        style={{
                            position: "absolute",
                            top: Spacing * 5,
                            left: Spacing,
                            zIndex: 1,
                        }}
                        onPress={() => navigate("ViewProjects")}
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
                            fontSize: FontSize.xxLarge,
                            color: Colors.primary,
                            fontFamily: Font["poppins-bold"],
                            textAlign: "center",
                        }}
                    >
                        {projectName}
                    </Text>

                    <Text
                        style={{
                            fontSize: FontSize.large,
                            fontFamily: Font["poppins-bold"],
                            textAlign: "center",
                        }}
                    >
                        {projectDescription}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingTop: Spacing * 4, }}>
                {Buttons.map((button, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={button.onPress}
                        style={{
                            width: 160,
                            height: 120,
                            margin: Spacing / 2,
                            backgroundColor: buttonColors[button.label],
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                            shadowColor: Colors.primary,
                            shadowOffset: {
                                width: 0,
                                height: Spacing,
                            },
                            shadowOpacity: 0.3,
                            shadowRadius: Spacing,
                        }}>
                        <FontAwesome
                            name={button.icon}
                            size={50}
                            color={Colors.onPrimary}
                        />
                        <Text
                            style={{
                                color: Colors.onPrimary,
                                fontFamily: Font['poppins-bold'],
                                textAlign: 'center',
                            }}>
                            {button.label}
                        </Text>
                    </TouchableOpacity>
                ))
                }
            </View>
        </SafeAreaView>
    );
};

export default ProjectDashboard;

const styles = StyleSheet.create({});

function refetchTeams() {
    throw new Error("Function not implemented.");
}

