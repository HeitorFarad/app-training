import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function PerfilProfissionalScreen() {
  const navigation = useNavigation();
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    descricao: '',
    fotoUrl: ''
  });
  const [celular, setCelular] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const dadosSalvos = await AsyncStorage.getItem('@profissional_logado');
    if (dadosSalvos) {
      const parsed = JSON.parse(dadosSalvos);
      setDados(parsed);
      setCelular(parsed.celular || '');
    }
  };

  const salvarAlteracoes = async () => {
    const listaJSON = await AsyncStorage.getItem('@profissionais');
    let lista = listaJSON ? JSON.parse(listaJSON) : [];

    const index = lista.findIndex((p) => p.email === dados.email);
    if (index !== -1) {
      const atualizado = {
        ...dados,
        celular
      };
      lista[index] = atualizado;

      await AsyncStorage.setItem('@profissionais', JSON.stringify(lista));
      await AsyncStorage.setItem('@profissional_logado', JSON.stringify(atualizado));

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } else {
      Alert.alert('Erro', 'Profissional não encontrado.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        placeholderTextColor="#aaa"
        value={dados.nome}
        onChangeText={(t) => setDados({ ...dados, nome: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={dados.email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={dados.senha}
        onChangeText={(t) => setDados({ ...dados, senha: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        placeholderTextColor="#aaa"
        value={dados.descricao}
        onChangeText={(t) => setDados({ ...dados, descricao: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="URL da Foto"
        placeholderTextColor="#aaa"
        value={dados.fotoUrl || ''}
        onChangeText={(t) => setDados({ ...dados, fotoUrl: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Celular"
        placeholderTextColor="#aaa"
        value={celular}
        onChangeText={setCelular}
      />

      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  link: {
    color: '#bbb',
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});
