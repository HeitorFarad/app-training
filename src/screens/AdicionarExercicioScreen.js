import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import exercisesJson from '../data/exercises.json';
import { useNavigation, useRoute } from '@react-navigation/native';

const gruposDisponiveis = [
  'Peitoral', 'Costas', 'Tríceps', 'Bíceps',
  'Ombros', 'Quadríceps', 'Posterior de Coxa',
  'Glúteos', 'Core', 'Corpo inteiro', 'Cardio'
];

export default function AdicionarExercicioScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { diaIndex, grupoSelecionado, localTreino, onAdd } = route.params;

  const [grupo, setGrupo] = useState(grupoSelecionado || 'Peitoral');
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);

  useEffect(() => {
    const filtrados = exercisesJson.filter(
      (ex) => ex.grupo_muscular === grupo && ex.local === localTreino
    );
    setExerciciosFiltrados(filtrados);
  }, [grupo]);

  const handleAdicionar = (exercicio) => {
    const { exerciciosDoDia } = route.params;

    const jaExiste = exerciciosDoDia?.some((ex) => ex.nome === exercicio.nome);

    if (jaExiste) {
        Alert.alert('Já adicionado', 'Este exercício já está presente no treino do dia.');
        return;
    }

    if (typeof onAdd === 'function') {
        onAdd(diaIndex, exercicio);
        navigation.goBack();
    } else {
        Alert.alert('Erro', 'Função de retorno inválida.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adicionar Exercício</Text>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Selecionar grupo muscular:</Text>
      <View style={styles.grupoBox}>
        {gruposDisponiveis.map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.grupoBtn, grupo === g && styles.grupoAtivo]}
            onPress={() => setGrupo(g)}
          >
            <Text style={styles.grupoTexto}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Exercícios de {grupo}:</Text>
      {exerciciosFiltrados.length === 0 && (
        <Text style={{ color: '#888' }}>Nenhum exercício disponível.</Text>
      )}
      {exerciciosFiltrados.map((ex, i) => (
        <TouchableOpacity
          key={i}
          style={styles.exercicioBox}
          onPress={() => handleAdicionar(ex)}
        >
          <Text style={styles.exNome}>{ex.nome}</Text>
          <Text style={styles.exDesc}>{ex.descricao}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212'
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 16
  },
  label: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 10
  },
  grupoBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10
  },
  grupoBtn: {
    backgroundColor: '#1f1f1f',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    margin: 4
  },
  grupoAtivo: {
    backgroundColor: '#4caf50'
  },
  grupoTexto: {
    color: '#fff',
    fontSize: 14
  },
  exercicioBox: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  exNome: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  exDesc: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4
  },
  voltar: {
  color: '#bbb',
  fontSize: 16,
  textDecorationLine: 'underline',
  marginBottom: 16
  }
});
