import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import AppTextInput from "../../../components/AppTextInput";
import { useMutation, useQuery } from "@apollo/client";
import { useUserStore } from "../../../stores/useUserStore";
import Toast from "react-native-toast-message";
import useButtonTimeout from "../../../hooks/useButtonTimeout";
import { Icon } from "@rneui/themed";
import { CREATETASK } from "../../../graphql/mutations";
import { Picker } from "@react-native-picker/picker";
import { GETUSERSTEAMSIDS } from "../../../graphql/queries";
import GradientWrapper from "../../../components/GradientWrapper";

type Props = NativeStackScreenProps<RootStackParamList, "TaskCreation">;

const TaskCreation: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { userId } = useUserStore();
  const { projectId } = useUserStore();
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [idUser, setIdUser] = useState();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { projectTeamsIds, setProjectTeamsIds } = useUserStore();
  const { data: usersData, refetch: refetchUsers } = useQuery(GETUSERSTEAMSIDS, {
    variables: {
      teamIds: projectTeamsIds,
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createTask, { data }] = useMutation(CREATETASK);

  useButtonTimeout(
    () => {
      setIsSubmitting(false);
    },
    1500,
    isSubmitting
  );

  const refetchUsersData = async () => {
    await refetchUsers();
    setFilteredUsers(usersData?.usersByTeamIds);
  };

  useEffect(() => {
    refetchUsersData();
  }, [usersData]);

  const handleTeamCreation = async () => {
    setIsSubmitting(true);
    if (taskName === "" || taskDescription === "") {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Todos los campos deben estar llenos",
        position: "bottom",
        visibilityTime: 1500, // Duration in milliseconds
        autoHide: true,
      });
    } else {
      try {
        setIsLoading(true);
        const { data } = await createTask({
          variables: {
            idCreator: userId,
            idProject: projectId,
            idUser: idUser,
            name: taskName,
            description: taskDescription,
            startDate: new Date(),
            finishDate: null
          },
        });
        setIsLoading(false);
        if (data && data.createTask) {
          Toast.show({
            type: "success",
            text1: "La tarea ha sido creada",
            text2: "Regresando al dashboard",
            position: "bottom",
            visibilityTime: 1500, // Duration in milliseconds
            autoHide: true,
          });
          navigate("ProjectDashboard");
        }
      } catch (e) {
        setIsSubmitting(false);
        setIsLoading(false);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: e.message,
          position: "bottom",
          visibilityTime: 3000, // Duration in milliseconds
          autoHide: true,
        });
      }
    }
  };

  return (
    <GradientWrapper>
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
            <TouchableOpacity
              style={{
                position: "absolute",
                top: Spacing * 2,
                left: -Spacing,
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
                fontSize: FontSize.xLarge,
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
                marginVertical: Spacing * 3,
                marginHorizontal: Spacing * 5,
                textAlign: "center",
              }}
            >
              Crea tu tarea
            </Text>
          </View>
          <View
            style={{
              marginVertical: Spacing * 1,
            }}
          >
            <AppTextInput
              placeholder="Nombre de la tarea"
              value={taskName}
              onChangeText={setTaskName}
              maxLength={20}
            />
            <AppTextInput
              placeholder="Descripción de la tarea"
              value={taskDescription}
              onChangeText={setTaskDescription}
              maxLength={30}
            />
            <View
              style={{
                marginVertical: Spacing * 1,
              }}
            >
              <Picker
                style={{
                  fontFamily: Font["poppins-regular"],
                  fontSize: FontSize.small,
                  padding: Spacing * 2,
                  backgroundColor: Colors.lightPrimary,
                  borderRadius: Spacing,
                  marginVertical: Spacing,
                }}
                selectedValue={idUser}
                onValueChange={(itemValue, itemIndex) => setIdUser(itemValue)}
              >
                <Picker.Item style={{ fontFamily: Font["poppins-regular"] }} label="Selecciona un usuario" value={null} />
                
                {filteredUsers?.map((user) => (
                  <Picker.Item key={user.id} label={user.name} value={user.id} />
                ))}
                
              </Picker>
            </View>
            
            
          </View>

          <TouchableOpacity
            onPress={() => handleTeamCreation()}
            disabled={isLoading || isSubmitting}
            style={{
              padding: Spacing * 2,
              backgroundColor: isSubmitting ? Colors.disabled : Colors.primary,
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
            {isLoading || isSubmitting ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: Colors.onPrimary,
                  textAlign: "center",
                  fontSize: FontSize.large,
                }}
              >
                Crear Tarea
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientWrapper>
  );
};

export default TaskCreation;
