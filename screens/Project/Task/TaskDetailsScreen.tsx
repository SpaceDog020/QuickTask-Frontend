import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
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
import { useFocusEffect } from "@react-navigation/native";

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
          setUserResponsable('');
        });
      } else {
        if (taskIdCreator === null && taskIdUserResponsable !== null) {
          await refetchUsers({ ids: [taskIdUserResponsable] }).then((res) => {
            setCreator('');
            setUserResponsable(res.data.usersByIds[0].name);
          });
        }
      }
    }
  };

  useEffect(() => {
    refetchUsersData();
  }, [userData, taskIdUserResponsable]);

  useFocusEffect(
    React.useCallback(() => {
      refetchUsersData();
    }, [userData, taskIdUserResponsable])
  );

  return (
    <SafeAreaView>
      <View
        style={{
          padding: Spacing * 2,
          marginTop: Spacing * 2,
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
              top: Spacing * 1,
              left: -Spacing,
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
          <TouchableOpacity
            style={{
              position: "absolute",
              top: Spacing * 1,
              right: -Spacing,
              zIndex: 1,
            }}
            onPress={() => navigate('EditTask')}
          >
            <Icon
              raised
              name='sliders-h'
              type='font-awesome-5'
              color={Colors.primary} />
          </TouchableOpacity>
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
            <FontAwesome name="crown" size={20} color={Colors.primary} />
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
        <Text style={{ fontSize: FontSize.large, fontFamily: Font["poppins-bold"], textAlign: "center", color: Colors.text }}>Comentarios:</Text>
        <ScrollView style={{ maxHeight: 361 }}>
          {taskComments.map((comment, index) => (
            <View key={index} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: Spacing }}>
              <FontAwesome name="comment" size={20} color={Colors.primary} />
              <Text
                key={index}
                style={{
                  fontSize: FontSize.medium,
                  textAlign: "center",
                  color: Colors.text,
                  marginLeft: Spacing / 2,
                  maxWidth: '80%',
                  overflow: 'hidden',
                }}
              >
                {comment}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({});