import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppTextInput from "../components/AppTextInput";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import Spacing from "../constants/Spacing";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { CHANGEPASSWORD } from "../graphql/mutations";
import { useMutation } from "@apollo/client";

type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

const ChangePassword: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== repeatNewPassword) {
      // Passwords do not match
      alert("New passwords do not match.");
    } else {
      // Perform a password change request to your backend or authentication service
      // You may need to pass currentPassword and newPassword to your API
      // Handle success and error cases accordingly

      // After a successful password change, navigate back to the user profile screen or any other screen
      // where the user can continue using your app.
      navigate("UserProfile");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>

        <AppTextInput
          placeholder="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />

        <AppTextInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <AppTextInput
          placeholder="Repeat New Password"
          value={repeatNewPassword}
          onChangeText={setRepeatNewPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing * 2,
  },
  title: {
    fontSize: FontSize.xLarge,
    color: Colors.primary,
    fontFamily: Font["poppins-bold"],
    marginVertical: Spacing * 3,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing * 2,
    marginVertical: Spacing * 7,
    borderRadius: Spacing,
  },
  buttonText: {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },
});

export default ChangePassword;
