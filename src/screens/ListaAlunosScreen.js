import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ListaAlunosScreen() {
  const [alunos, setAlunos] = useState([]);
  const [profissionalEmail, setProfissionalEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const carregarAlunos = async () => {
      const prof = await AsyncStorage.getItem('@profissional_logado');
      const todosAlunos = await AsyncStorage.getItem('@alunos');
      const vinculacoes = await AsyncStorage.getItem('@vinculos');

      const profissional = prof ? JSON.parse(prof) : null;
      const listaAlunos = todosAlunos ? JSON.parse(todosAlunos) : [];
      const listaVinculos = vinculacoes ? JSON.parse(vinculacoes) : [];

      const vinculados = listaVinculos
        .filter((v) => v.profissional === profissional.email)
        .map((v) => {
          const aluno = listaAlunos.find((a) => a.email === v.aluno);
          return aluno ? { ...aluno } : null;
        })
        .filter(Boolean);

      setProfissionalEmail(profissional?.email || '');
      setAlunos(vinculados);
    };

    carregarAlunos();
  }, []);

  const irParaDetalhes = (aluno) => {
    navigation.navigate('GerenciarAluno', { aluno });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meus Alunos</Text>

      {alunos.length === 0 ? (
        <Text style={styles.sem}>Nenhum aluno vinculado.</Text>
      ) : (
        alunos.map((aluno, i) => (
          <TouchableOpacity
            key={i}
            style={styles.card}
            onPress={() => irParaDetalhes(aluno)}
          >
            <Text style={styles.nome}>{aluno.nome}</Text>
            <Text style={styles.email}>{aluno.email}</Text>
          </TouchableOpacity>
        ))
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar ao Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flexGrow: 1,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20
  },
  sem: {
    color: '#bbb',
    fontSize: 16,
    marginTop: 20
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    marginBottom: 12
  },
  nome: {
    fontSize: 16,
    color: '#ffca28'
  },
  email: {
    color: '#ccc',
    fontSize: 14
  },
  voltar: {
    color: '#bbb',
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: 'underline'
  }
});
