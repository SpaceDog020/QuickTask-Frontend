import { StyleSheet, View } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import React from "react";
import LoginForm from './screens/Login';
import RegisterForm from './screens/Register';

const client = new ApolloClient({
  uri: 'http://192.168.0.2:3000/graphql',
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <View style={styles.container}>
      <ApolloProvider client={client}>
        <RegisterForm/>
      </ApolloProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});