import React from 'react';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import Colors from "../constants/Colors"; // Import your color constants

const CustomToast = ({ type, text1, text2 }) => {
  return (
    <View
      style={{
        marginHorizontal: 15,
        marginBottom: 15,
        backgroundColor:
          type === 'success' ? Colors.success : Colors.error, // Customize colors based on the toast type
        padding: 10,
        borderRadius: 8,
        elevation: 6,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
        {text1}
      </Text>
      <Text style={{ color: '#fff', fontSize: 14, textAlign: 'center' }}>{text2}</Text>
    </View>
  );
};

export default CustomToast;
