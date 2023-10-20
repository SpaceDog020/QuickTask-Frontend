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
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
const { height } = Dimensions.get("window");
import { useUserStore } from '../stores/useUserStore';
import { useQuery } from "@apollo/client";
import { GETTEAMBYID } from "../graphql/queries";
import { useFocusEffect } from "@react-navigation/core";

type Props = NativeStackScreenProps<RootStackParamList, "TeamDetails">;

const TeamDetails: React.FC<Props> = ({ navigation: { navigate } }) => {
    const { teamId, setTeamId } = useUserStore();

    const { data: teamData } = useQuery(GETTEAMBYID, {
        variables: {
          id: teamId,
        },
    });

    return (
        <SafeAreaView>
        <View>
            <View
            style={{
                paddingTop: Spacing * 6,
            }}
            >
            <Text
                style={{
                fontSize: FontSize.xxLarge,
                color: Colors.primary,
                fontFamily: Font["poppins-bold"],
                textAlign: "center",
                }}
            >
                {}
            </Text>
            </View>
        </View>
        </SafeAreaView>
    );

};

export default TeamDetails;

const styles = StyleSheet.create({});