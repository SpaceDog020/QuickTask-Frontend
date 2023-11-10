import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import fonts from './config/fonts';
import Navigation from './navigation';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import Toast from 'react-native-toast-message';
import CustomToast from './components/CustomToast'; // Import your custom toast component
import Colors from './constants/Colors';

const client = new ApolloClient({
  uri: 'http://10.151.26.208:3000/graphql',
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
