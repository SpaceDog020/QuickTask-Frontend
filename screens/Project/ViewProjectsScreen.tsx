import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "../../constants/Spacing";
import FontSize from "../../constants/FontSize";
import Colors from "../../constants/Colors";
import Font from "../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
const { height } = Dimensions.get("window");
import { useUserStore } from '../../stores/useUserStore';
import { useQuery } from "@apollo/client";
import { GETTEAMDETAILS, GETUSERIDBYEMAIL, PROJECTSBYTEAMS } from "../../graphql/queries";
import { useFocusEffect } from "@react-navigation/core";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { Icon } from "@rneui/themed";

type Props = NativeStackScreenProps<RootStackParamList, "ViewProjects">;

const ViewProjects: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userId } = useUserStore();
  const [projects, setProjects] = useState([]);
  const [teamIds, setTeamIds] = useState([]);
  const { projectId, setProjectId } = useUserStore();
  const { projectName, setProjectName } = useUserStore();
  const { projectDescription, setProjectDescription } = useUserStore();
  const { projectTeamsIds, setProjectTeamsIds } = useUserStore();

  const { data: teamData, refetch: refetchTeams } = useQuery(GETTEAMDETAILS, {
    variables: {
      id: userId,
    },
  });

  const { data: projectData, refetch: refetchProjects } = useQuery(PROJECTSBYTEAMS, {
    variables: {
      teamIds,
    },
  });

  useEffect(() => {
    if (teamData) {
      const teams = teamData?.teamsByUserId || [];
      const ids = teams.map((team) => team.id);
      setTeamIds(ids);
      refetchProjects()
        .then(({ data }) => {
          setProjects(data?.projectsByTeams || []);
        })
        .catch((error) => {
          console.log("Error al cargar equipos:", error);
        });
    }
  }, [teamData, projectData]);

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
            onPress={() => navigate("Dashboard")}
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
            Proyectos
          </Text>
        </View>
      </View>

      <ScrollView style={{ maxHeight: 600 }}>
        {projects &&
          projects.map((project) => (
            <View
              key={project.id}
              style={{
                paddingHorizontal: Spacing * 2,
                paddingTop: Spacing * 2,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setProjectId(project.id);
                  setProjectName(project.name);
                  setProjectDescription(project.description);
                  setProjectTeamsIds(project.teamsIds);
                  navigate("ProjectDetails");
                }}
                style={{
                  backgroundColor: Colors.primary,
                  paddingVertical: Spacing * 1,
                  paddingHorizontal: Spacing * 2,
                  width: "100%",
                  borderRadius: Spacing,
                  shadowColor: Colors.primary,
                  shadowOffset: {
                    width: 0,
                    height: Spacing,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: Spacing,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontFamily: Font["poppins-bold"],
                    color: Colors.onPrimary,
                    fontSize: FontSize.large,
                  }}
                >
                  {project.name}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        }
      </ScrollView>
    </SafeAreaView>
  );

};

export default ViewProjects;

const styles = StyleSheet.create({});