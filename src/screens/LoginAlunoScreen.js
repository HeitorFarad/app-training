import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function LoginAlunoScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    const dados = await AsyncStorage.getItem('@alunos');
    const lista = dados ? JSON.parse(dados) : [];

    const usuario = lista.find((u) => u.email === email && u.senha === senha);

    if (usuario) {
      await AsyncStorage.setItem('@aluno_logado', JSON.stringify(usuario));
      navigation.navigate('MainMenu');
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  const irParaCadastro = () => {
    navigation.navigate('CadastroAluno');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login do Aluno</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={irParaCadastro}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  link: {
    color: '#4fc3f7',
    marginTop: 20,
    textAlign: 'center'
  }
});
