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

export default function CadastroProfissionalScreen() {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [descricao, setDescricao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [celular, setCelular] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const dados = await AsyncStorage.getItem('@profissionais');
    const lista = dados ? JSON.parse(dados) : [];

    const jaExiste = lista.some((u) => u.email === email);
    if (jaExiste) {
      Alert.alert('Erro', 'Já existe um profissional com esse email.');
      return;
    }

    const novo = {
      nome,
      email,
      senha,
      descricao,
      fotoUrl: fotoUrl || null,
      celular
    };

    lista.push(novo);
    await AsyncStorage.setItem('@profissionais', JSON.stringify(lista));

    Alert.alert('Sucesso', 'Conta de profissional criada com sucesso!');
    navigation.navigate('LoginProfissional');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Profissional</Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />
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
      <TextInput
        placeholder="Descrição (qualificação)"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        placeholder="Celular"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={celular}
        onChangeText={setCelular}
      />

      <TextInput
        placeholder="URL da Foto (opcional)"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={fotoUrl}
        onChangeText={setFotoUrl}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>← Voltar ao Login</Text>
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
    fontSize: 22,
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
