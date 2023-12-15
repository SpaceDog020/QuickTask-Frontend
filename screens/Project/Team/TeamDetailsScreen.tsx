import {
    Modal,
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
import { GETTEAMSBYIDS, GETUSERSBYIDS } from "../../../graphql/queries";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Spacing from "../../../constants/Spacing";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import FontSize from "../../../constants/FontSize";
import { Icon } from "@rneui/themed";
import { REMOVETEAMPROJECT } from "../../../graphql/mutations";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetails">;

const TeamDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
    const [teams, setTeams] = useState([]);
    const { projectId } = useUserStore();
    const { projectTeamsIds, setProjectTeamsIds } = useUserStore();
    const [modalVisible, setModalVisible] = useState(false);  // Nuevo estado para controlar la visibilidad del modal
    const [modalUsers, setModalUsers] = useState([]);

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

    const { data: userData, refetch: refetchUsers } = useQuery(GETUSERSBYIDS, {
        skip: true,
    });

    const [removeTeamProjectMutation, { data }] = useMutation(REMOVETEAMPROJECT);

    const handleViewUsers = async (teamId) => {
        const team = teams.find((team) => team.id === teamId);

        if (team && team.idUsers) {
            await refetchUsers({ ids: team.idUsers })
                .then((res) => {
                    setModalUsers(res.data.usersByIds);
                    setModalVisible(true);
                })
        }
    };

    const kickTeam = async (idProject, idTeam, idUsers) => {
        setIsSubmitting(true);
        try {
            setIsLoading(true);
            const { data } = await removeTeamProjectMutation({
                variables: {
                    idProject: idProject,
                    idTeam: idTeam,
                    idUsers: idUsers
                },
            });
            setIsLoading(false);
            if (data && data.removeTeamProject) {
                Toast.show({
                    type: "success",
                    text1: "Éxito",
                    text2: "Equipo expulsado",
                    position: "bottom",
                    visibilityTime: 1500, // Duration in milliseconds
                    autoHide: true,
                });
                refetchTeams();
                setProjectTeamsIds(projectTeamsIds.filter((teamId) => teamId !== idTeam));
                setIsSubmitting(false);
            }
        } catch (error) {
            setIsSubmitting(false);
            setIsLoading(false);
            Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
                position: "bottom",
                visibilityTime: 1500, // Duration in milliseconds
                autoHide: true,
            });
        }
    };

    useEffect(() => {
        refetchTeams();
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
                            color={Colors.primary}
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: FontSize.xxLarge,
                            color: Colors.primary,
                            fontFamily: Font["poppins-bold"],
                            textAlign: "center",
                        }}
                    >
                        Equipos
                    </Text>
                </View>
            </View>

            <ScrollView style={{ maxHeight: 600 }}>
                {teams.length === 0 ? (
                    <View
                        style={{
                            paddingHorizontal: Spacing * 2,
                            paddingTop: Spacing * 2,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontSize: FontSize.large, color: Colors.primary }}>
                            No hay equipos disponibles.
                        </Text>
                    </View>
                ) : (
                    teams.map((team) => (
                        <View key={team.id} style={{ paddingHorizontal: Spacing * 2, paddingTop: Spacing * 2 }}>
                            <TouchableOpacity
                                disabled={isLoading || isSubmitting}
                                style={{
                                    backgroundColor: Colors.primary,
                                    paddingVertical: Spacing * 1,
                                    paddingHorizontal: Spacing * 2,
                                    width: "100%",
                                    borderRadius: Spacing,
                                    shadowColor: Colors.primary,
                                    shadowOffset: { width: 0, height: Spacing },
                                    shadowOpacity: 0.3,
                                    shadowRadius: Spacing,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                                onPress={() => handleViewUsers(team.id)}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
                                    <Text
                                        style={{
                                            fontFamily: Font["poppins-bold"],
                                            color: Colors.onPrimary,
                                            fontSize: FontSize.large,
                                        }}
                                    >
                                        {team.name} {team.lastName}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', width: '50%' }}>
                                    <TouchableOpacity
                                        disabled={isLoading || isSubmitting}
                                        onPress={() => kickTeam(projectId, team.id, team.idUsers)}
                                        style={{
                                            backgroundColor: Colors.error,
                                            paddingVertical: Spacing * 1,
                                            paddingHorizontal: Spacing * 2,
                                            borderRadius: Spacing,
                                            shadowColor: Colors.error,
                                            shadowOffset: {
                                                width: 0,
                                                height: Spacing,
                                            },
                                            shadowOpacity: 0.3,
                                            shadowRadius: Spacing,
                                            marginLeft: Spacing,
                                        }}
                                    >
                                        <FontAwesome
                                            name={'user-minus'}
                                            size={20}
                                            color={Colors.onPrimaryToast}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, elevation: 5, width: '80%', maxHeight: '80%' }}>
                        {modalUsers.map((user) => (
                            <TouchableOpacity
                                disabled={true}
                                key={user.id}
                                style={{
                                    backgroundColor: Colors.primary,
                                    paddingVertical: Spacing * 1,
                                    paddingHorizontal: Spacing * 2,
                                    marginTop: Spacing,
                                    borderRadius: Spacing,
                                    shadowColor: Colors.primary,
                                    shadowOffset: { width: 0, height: Spacing },
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
                                        color: Colors.onPrimary,
                                        fontSize: FontSize.large,
                                    }}
                                >
                                    {user.name} {user.lastName} {user.role}
                                </Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            onPress={() => setModalVisible(!modalVisible)}
                            style={{ marginTop: Spacing * 2 }}
                        >
                            <Text style={{ color: Colors.primary, fontSize: FontSize.large }}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
};

export default TeamDetails;
