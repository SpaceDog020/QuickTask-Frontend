import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
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
import GradientWrapper from "../../../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "ViewTasks">;

const ViewTasks: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { projectId, userId } = useUserStore();
  const [tasks, setTasks] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showMyTasks, setShowMyTasks] = useState(false);

  const { setTaskId } = useUserStore();
  const { setTaskName } = useUserStore();
  const { setTaskDescription } = useUserStore();
  const { setTaskIdUserResponsable } = useUserStore();
  const { setTaskIdCreator } = useUserStore();
  const { setTaskStatus } = useUserStore();
  const { setTaskStartDate } = useUserStore();
  const { setTaskFinishDate } = useUserStore();
  const { setTaskComments } = useUserStore();

  const { data: taskData, refetch: refetchTasks } = useQuery(GETTASKSBYPROJECTID, {
    variables: {
      projectId: projectId,
    },
  });

  const refetchTasksData = async () => {
    await refetchTasks();
    setTasks(taskData?.tasksByProjectId);
  };

  useEffect(() => {
    refetchTasksData();
  }, [taskData]);

  const filteredTasks = tasks?.filter((task) =>
    task.name.toLowerCase().includes(searchInput.toLowerCase())
  ) || [];

  const filteredMyTasks = showMyTasks ? filteredTasks?.filter((task) => task.idUser === userId) : filteredTasks;

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
            Tareas
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: Spacing }}>
        <TextInput
          style={{
            height: 40,
            borderColor: Colors.primary,
            borderWidth: 1,
            borderRadius: Spacing,
            paddingHorizontal: Spacing,
            marginBottom: Spacing,
            flex: 1,
          }}
          placeholder="Buscar tarea..."
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
        />

        <TouchableOpacity
          style={{
            height: 40,
            backgroundColor: showMyTasks ? Colors.disabled : Colors.primary,
            borderRadius: Spacing,
            padding: Spacing,
            marginLeft: Spacing,
          }}
          onPress={() => setShowMyTasks(!showMyTasks)}
        >
          <Text style={{ color: Colors.onPrimary }}>Mis Tareas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ maxHeight: 600 }}>
        {filteredMyTasks.length === 0 ? (
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
              Tareas
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between", padding: Spacing }}>
          <TextInput
            style={{
              height: 40,
              borderColor: Colors.primary,
              borderWidth: 1,
              borderRadius: Spacing,
              paddingHorizontal: Spacing,
              marginBottom: Spacing,
              flex: 1,
            }}
            placeholder="Buscar tarea..."
            value={searchInput}
            onChangeText={(text) => setSearchInput(text)}
          />
          
          <TouchableOpacity
            style={{
              height: 40,
              backgroundColor: showMyTasks ? Colors.disabled : Colors.primary,
              borderRadius: Spacing,
              padding: Spacing,
              marginLeft: Spacing,
            }}
            onPress={() => setShowMyTasks(!showMyTasks)}
          >
            <Text style={{ color: Colors.onPrimary }}>Mis Tareas</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ maxHeight: 600 }}>
          {filteredMyTasks.length === 0 ? (
            <View
              style={{
                paddingHorizontal: Spacing * 2,
                paddingTop: Spacing * 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setTaskId(task.id);
                  setTaskIdCreator(task.idCreator);
                  setTaskName(task.name);
                  setTaskDescription(task.description);
                  setTaskIdUserResponsable(task.idUser);
                  setTaskStatus(task.status);
                  setTaskStartDate(task.startDate);
                  setTaskFinishDate(task.finishDate);
                  setTaskComments(task.comment);
                  navigate("TaskDetails");
                }}
                style={{
                  flex: 1,
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.primary,
                    paddingVertical: Spacing * 1,
                    paddingHorizontal: Spacing * 2,
                    borderRadius: Spacing,
                    shadowColor: Colors.primary,
                    shadowOffset: {
                      width: 0,
                      height: Spacing,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: Spacing,
                    flexDirection: "column",  // Cambiado de "row" a "column"
                    alignItems: "flex-start", // Cambiado de "center" a "flex-start"
                    justifyContent: "center",
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
                  <Text style={{
                    fontFamily: Font["poppins-bold"],
                    fontSize: FontSize.medium,
                    color: Colors.onPrimary,
                  }}
                  >
                    {task.idUser ? "Con Asignación" : "Sin Asignación"}
                  </Text>

                </View>
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

/*
<Text
  style={{
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    fontSize: FontSize.large,
  }}
>
  {task.status}
</Text>
*/