import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useUserStore } from '../../../stores/useUserStore';
import { useMutation, useQuery } from "@apollo/client";
import { GETTEAMBYID, GETTEAMSBYIDS, GETUSERSBYIDS } from "../../../graphql/queries";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Spacing from "../../../constants/Spacing";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import FontSize from "../../../constants/FontSize";
import { Icon } from "@rneui/themed";
import { CHANGECREATOR, KICKUSER } from "../../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetails">;

const TeamDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
    const [teams, setTeams] = useState([]);
    const { projectId } = useUserStore();
    const { projectTeamsIds } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    useButtonTimeout(
        () => {
            setIsSubmitting(false);
        },
        1500,
        isSubmitting
    );

    const { data: teamData, refetch: refetchTeams } = useQuery(GETTEAMSBYIDS, {
        variables: {
            ids: projectTeamsIds,
        },
    });

    useEffect(() => {
        if (teamData && teamData.teamsByIds) {
            setTeams(teamData.teamsByIds);
        }
    }, [teamData]);

    return (
        <SafeAreaView>
            <View>
                <View
                    style={{
                        paddingTop: Spacing * 6,
                    }}
                >
                    <TouchableOpacity
                        disabled={isLoading || isSubmitting}
                        style={{
                            position: "absolute",
                            top: Spacing * 5,
                            left: Spacing,
                            zIndex: 1,
                        }}
                        onPress={() => navigate("ProjectDashboard")}
                    >
                        <Icon
                            raised
                            size={25}
                            name='arrow-back'
                            type='Ionicons'
                            color={Colors.primary} // Utiliza tu color primario
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: FontSize.xxLarge,
                            color: Colors.primary, // Utiliza tu color primario
                            fontFamily: Font["poppins-bold"],
                            textAlign: "center",
                        }}
                    >
                        Equipos
                    </Text>
                </View>
            </View>

            <ScrollView style={{ maxHeight: 600 }}>
                {teams &&
                    teams.map((team) => (
                        <View
                            key={team.id}
                            style={{
                                paddingHorizontal: Spacing * 2,
                                paddingTop: Spacing * 2,
                                flexDirection: "row",
                            }}
                        >
                            <TouchableOpacity
                                disabled={true}
                                style={{
                                    backgroundColor: Colors.primary, // Utiliza tu color primario
                                    paddingVertical: Spacing * 1,
                                    paddingHorizontal: Spacing * 2,
                                    width: "100%",
                                    borderRadius: Spacing,
                                    shadowColor: Colors.primary, // Utiliza tu color primario
                                    shadowOffset: {
                                        width: 0,
                                        height: Spacing,
                                    },
                                    shadowOpacity: 0.3,
                                    shadowRadius: Spacing,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: Font["poppins-bold"],
                                        color: Colors.onPrimary, // Utiliza tu color para texto en el fondo primario
                                        fontSize: FontSize.large,
                                    }}
                                >
                                    {team.name} {team.lastName}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    );
};

export default TeamDetails;
