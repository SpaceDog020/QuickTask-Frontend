import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useMutation } from '@apollo/client';
import { REGISTER } from '../graphql/mutations';

const RegisterForm = () => {

    const [name, setName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [register, { data }] = useMutation(REGISTER);
  
    const handleRegister = async () => {
        await register({
            variables: {
                name,
                lastName,
                email,
                password,
            }
        });
    };

    return (
        <View>
          <Text>Nombre:</Text>
          <TextInput value={name} onChangeText={setName} />
          <Text>Apellido:</Text>
          <TextInput value={lastName} onChangeText={setlastName} />
          <Text>Email:</Text>
          <TextInput value={email} onChangeText={setEmail} />
          <Text>Contraseña:</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry />
          <Button title="Registrarse" onPress={handleRegister} />
          {data && <Text>{data.register.response}</Text>}
        </View>
    );
};

export default RegisterForm;