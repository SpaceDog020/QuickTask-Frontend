import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import { LOGIN } from '../graphql/mutations';

const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { data }] = useMutation(LOGIN);

  const handleLogin = async () => {
    await login({
      variables: {
        email,
        password,
      },
    });
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} />
      <Text>Contraseña:</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Iniciar sesión" onPress={handleLogin} />
      {data && <Text>{data.login.response}</Text>}
    </View>
  );
};

export default LoginForm;
