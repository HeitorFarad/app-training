import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function GerenciarAlunoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { aluno } = route.params;

  const [anamnese, setAnamnese] = useState(null);
  const [planoExistente, setPlanoExistente] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const dadosAnamnese = await AsyncStorage.getItem(`@anamnese_${aluno.email}`);
      const plano = await AsyncStorage.getItem(`@plano_${aluno.email}`);

      if (dadosAnamnese) setAnamnese(JSON.parse(dadosAnamnese));
      if (plano) setPlanoExistente(JSON.parse(plano));
    };

    carregar();
  }, []);

  const criarNovoPlano = () => {
    navigation.navigate('CriarPlanoProfissional', { aluno });
  };

  const editarPlano = () => {
    navigation.navigate('EditarPlanoProfissional', { aluno, plano: planoExistente });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Aluno: {aluno.nome}</Text>
      <Text style={styles.sub}>Email: {aluno.email}</Text>

      <Text style={styles.section}>Anamnese:</Text>
      {anamnese ? (
        Object.entries(anamnese).map(([key, value], i) => (
          <Text key={i} style={styles.item}>
            {key}: {String(value)}
          </Text>
        ))
      ) : (
        <Text style={styles.item}>Nenhuma anamnese encontrada.</Text>
      )}

      <Text style={styles.section}>Plano de Treino:</Text>
      {planoExistente ? (
        <>
          <Text style={styles.item}>Plano já criado.</Text>
          <TouchableOpacity style={styles.button} onPress={editarPlano}>
            <Text style={styles.buttonText}>Editar Plano</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.button} onPress={criarNovoPlano}>
          <Text style={styles.buttonText}>Criar Plano</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flexGrow: 1,
    padding: 20
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 10
  },
  sub: {
    color: '#ccc',
    marginBottom: 20
  },
  section: {
    color: '#4fc3f7',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8
  },
  item: {
    color: '#ddd',
    fontSize: 14,
    marginBottom: 4
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  voltar: {
    marginTop: 20,
    fontSize: 16,
    color: '#bbb',
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});
