import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Spacing from "../../../constants/Spacing";
import FontSize from "../../../constants/FontSize";
import Colors from "../../../constants/Colors";
import Font from "../../../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { useUserStore } from "../../../stores/useUserStore";
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { Icon } from "@rneui/themed";
import { ADDCOMMENT } from "../../../graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";
import { GETUSERSBYIDS } from "../../../graphql/queries";

type Props = NativeStackScreenProps<RootStackParamList, "TaskDetails">;

const TaskDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
  const { taskName } = useUserStore();
  const { taskDescription } = useUserStore();
  const { taskStatus } = useUserStore();
  const { taskStartDate } = useUserStore();
  const { taskFinishDate } = useUserStore();
  const { taskComments } = useUserStore();
  const { taskIdCreator } = useUserStore();
  const { taskIdUserResponsable } = useUserStore();
  const [creator, setCreator] = useState('');
  const [userResponsable, setUserResponsable] = useState('');
  const [comment, setComment] = useState('');

  const [addComment, { data }] = useMutation(ADDCOMMENT);

  const { data: userData, refetch: refetchUsers } = useQuery(GETUSERSBYIDS, {
    skip: true,
  });

  const refetchUsersData = async () => {
    if (taskIdCreator !== null && taskIdUserResponsable !== null) {
      if (taskIdCreator === taskIdUserResponsable) {
        await refetchUsers({ ids: [taskIdCreator] }).then((res) => {
          setCreator(res.data.usersByIds[0].name);
          setUserResponsable(res.data.usersByIds[0].name);
        });
      } else {
        await refetchUsers({ ids: [taskIdCreator, taskIdUserResponsable] }).then((res) => {
          setCreator(res.data.usersByIds[0].name);
          setUserResponsable(res.data.usersByIds[1].name);
        });
      }
    } else {
      if (taskIdCreator !== null && taskIdUserResponsable === null) {
        await refetchUsers({ ids: [taskIdCreator] }).then((res) => {
          setCreator(res.data.usersByIds[0].name);
        });
      } else {
        if (taskIdCreator === null && taskIdUserResponsable !== null) {
          await refetchUsers({ ids: [taskIdUserResponsable] }).then((res) => {
            setUserResponsable(res.data.usersByIds[0].name);
          });
        }
      }
    }
  };

  useEffect(() => {
    refetchUsersData();
  }, [userData]);

  const Buttons = [
    {
      label: 'Editar Tarea',
      icon: 'sliders-h',
      onPress: () => navigate('EditTask'),
    },
  ];

  const buttonColors = {
    'Editar Tarea': 'dodgerblue',
  };

  return (
    <SafeAreaView>
      <View>
        <View
          style={{
            paddingTop: Spacing * 6,
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: Spacing * 5,
              left: Spacing,
              zIndex: 1,
            }}
            onPress={() => navigate("ViewTasks")}
          >
            <Icon
              raised
              size={25}
              name='arrow-back'
              type='Ionicons'
              color={Colors.primary} />
          </TouchableOpacity>
<<<<<<< HEAD
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 2,
            }}
          >
            Editar Equipo
          </Text>
          <TouchableOpacity
            disabled={isLoading || isSubmitting}
            style={{
              position: "absolute",
              top: Spacing * 1,
              right: -Spacing,
              zIndex: 1,
            }}
            onPress={() => setDeleteModalVisible(true)}
          >
            <Icon
              raised
              name='trash'
              type='font-awesome-5'
              color={Colors.error} />
          </TouchableOpacity>
=======
>>>>>>> c67db729b98d26b2eebd9b91d54fbe5673544d27
        </View>
      </View>

      <Text style={{ marginTop: Spacing * 4, fontSize: FontSize.xxLarge, color: Colors.primary, fontFamily: Font["poppins-bold"], textAlign: "center" }}>{taskName}</Text>

      <Text style={{ fontSize: FontSize.large, fontFamily: Font["poppins-bold"], textAlign: "center", color: Colors.text }}>{taskDescription}</Text>

      <Text style={{ fontSize: FontSize.large, fontFamily: Font["poppins-bold"], textAlign: "center", color: Colors.text }}>{taskStatus}</Text>

      {/* Fechas de Inicio y Finalización */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: Spacing }}>
        <Text style={{ fontSize: FontSize.medium, fontFamily: Font["poppins-bold"], color: Colors.text }}>Inicio: {taskStartDate}</Text>
        <Text style={{ fontSize: FontSize.medium, fontFamily: Font["poppins-bold"], color: Colors.text }}>Fin: {taskFinishDate}</Text>
      </View>

      {/* Mostrar creador y usuario responsable si están definidos */}
      {creator && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing }}>
          <FontAwesome name="user" size={20} color={Colors.primary} />
          <Text style={{ fontSize: FontSize.medium, fontFamily: Font["poppins-bold"], color: Colors.text, marginLeft: Spacing / 2 }}>{creator}</Text>
        </View>
      )}

      {userResponsable && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing }}>
          <FontAwesome name="user" size={20} color={Colors.primary} />
          <Text style={{ fontSize: FontSize.medium, fontFamily: Font["poppins-bold"], color: Colors.text, marginLeft: Spacing / 2 }}>{userResponsable}</Text>
        </View>
      )}

      {/* Mostrar comentarios */}
      <View style={{ marginTop: Spacing }}>
        <Text style={{ fontSize: FontSize.large, fontFamily: Font["poppins-bold"], textAlign: "center", color: Colors.text }}>Comentarios:</Text>
        {taskComments.map((comment, index) => (
          <Text key={index} style={{ fontSize: FontSize.medium, textAlign: "center", color: Colors.text }}>{comment}</Text>
        ))}
      </View>

      {/* Botones */}
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

export default TaskDetails;

const styles = StyleSheet.create({});