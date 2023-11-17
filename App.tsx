import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import fonts from './config/fonts';
import Navigation from './navigation';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Toast from 'react-native-toast-message';
import CustomToast from './components/CustomToast';
import { API_GATEWAY_URL } from '@env';

const client = new ApolloClient({
  uri: API_GATEWAY_URL,
  cache: new InMemoryCache(),
});

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  return !fontsLoaded ? null : (
    <ApolloProvider client={client}>
      <Navigation />
      <StatusBar />
      <Toast
        config={{
          success: ({ text1, text2 }) => (
            <CustomToast
              type="success"
              text1={text1}
              text2={text2}
            />
          ),
          error: ({ text1, text2 }) => (
            <CustomToast
              type="error"
              text1={text1}
              text2={text2}
            />
          ),
        }}
      />
    </ApolloProvider>
  );
}
