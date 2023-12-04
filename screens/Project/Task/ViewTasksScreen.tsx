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
  import Spacing from "../../../constants/Spacing";
  import FontSize from "../../../constants/FontSize";
  import Colors from "../../../constants/Colors";
  import Font from "../../../constants/Font";
  import { NativeStackScreenProps } from "@react-navigation/native-stack";
  import { RootStackParamList } from "../../../types";
  const { height } = Dimensions.get("window");
  import { useUserStore } from '../../../stores/useUserStore';
  import { useQuery } from "@apollo/client";
  import { GETTASKSBYPROJECTID } from "../../../graphql/queries";
  import { useFocusEffect } from "@react-navigation/core";
  import FontAwesome from "react-native-vector-icons/FontAwesome5";
  import { Icon } from "@rneui/themed";
  
  type Props = NativeStackScreenProps<RootStackParamList, "ViewTasks">;
  
  const ViewTasks: React.FC<Props> = ({ navigation: { navigate } }) => {
    const { projectId } = useUserStore();
    const [tasks, setTasks] = useState([]);

    console.log(projectId);
  
    const { data: taskData , refetch : refetchTasks} = useQuery(GETTASKSBYPROJECTID, {
        variables: {
            projectId: projectId,
        },
    });
    
    const refetchTasksData = async () => {
        await refetchTasks();
        setTasks(taskData?.tasksByProjectId);
        console.log(taskData?.tasksByProjectId);
      };
    
    useEffect(() => {
    refetchTasksData();
    }, [taskData]);

    
  
  
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
              onPress={() => navigate("ProjectDashboard")}
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
              Tareas
            </Text>
          </View>
        </View>
  
        <ScrollView style={{ maxHeight: 600 }}>
          {tasks?.length === 0 ? (
            <View
              style={{
                paddingHorizontal: Spacing * 2,
                paddingTop: Spacing * 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: FontSize.large, color: Colors.primary }}>
                No hay tareas.
              </Text>
            </View>
          ) : (
            tasks?.map((task) => (
              <View
                key={task.id}
                style={{
                  paddingHorizontal: Spacing * 2,
                  paddingTop: Spacing * 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  
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
                    {task.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  
  };
  
  export default ViewTasks;
  
  const styles = StyleSheet.create({});