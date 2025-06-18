import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditarTreinoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const treino = route.params?.treino;

  const [plano, setPlano] = useState(treino?.plano || []);
  const [treinoId] = useState(treino?.id || null);

  useEffect(() => {
    if (!treino || !treino.plano || !treino.id) {
      Alert.alert('Erro', 'Treino inválido.');
      navigation.goBack();
    }
  }, []);

  const removerExercicio = async (diaIndex, nome) => {
    const novoPlano = [...plano];
    const dia = novoPlano[diaIndex];
    dia.exercicios = dia.exercicios.filter((e) => e.nome !== nome);
    novoPlano[diaIndex] = dia;
    setPlano(novoPlano);

    const aluno = await AsyncStorage.getItem('@aluno_logado');
    const email = JSON.parse(aluno)?.email;
    const dados = await AsyncStorage.getItem(`@historico_treinos_${email}`);
    const lista = dados ? JSON.parse(dados) : [];

    const index = lista.findIndex((t) => t.id === treinoId);
    if (index !== -1) {
      lista[index].plano = novoPlano;
      await AsyncStorage.setItem(`@historico_treinos_${email}`, JSON.stringify(lista));
    }
  };

  const irParaAdicionar = (grupo, diaIndex) => {
    navigation.navigate('AdicionarExercicio', {
      diaIndex,
      grupoSelecionado: grupo,
      localTreino: 'academia', // trocar pelo valor real se desejar
      treinoId
    });
  };

  const agruparPorGrupo = (exercicios) => {
    const grupos = {};
    for (const ex of exercicios) {
      if (!grupos[ex.grupo_muscular]) grupos[ex.grupo_muscular] = [];
      grupos[ex.grupo_muscular].push(ex);
    }
    return grupos;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Treino</Text>

      {plano.map((dia, i) => {
        const grupos = agruparPorGrupo(dia.exercicios);
        return (
          <View key={i} style={styles.card}>
            <Text style={styles.dia}>{dia.dia}</Text>
            {Object.entries(grupos).map(([grupo, exercicios], idx) => (
              <View key={idx}>
                <View style={styles.headerGrupo}>
                  <Text style={styles.grupo}>{grupo}</Text>
                  <TouchableOpacity onPress={() => irParaAdicionar(grupo, i)}>
                    <Text style={styles.adicionar}>+ Adicionar</Text>
                  </TouchableOpacity>
                </View>
                {exercicios.map((ex, j) => (
                  <TouchableOpacity
                    key={j}
                    onPress={() =>
                      Alert.alert('Remover', `Remover ${ex.nome}?`, [
                        { text: 'Cancelar' },
                        {
                          text: 'Remover',
                          onPress: () => removerExercicio(i, ex.nome)
                        }
                      ])
                    }
                  >
                    <View style={styles.exBox}>
                      <Text style={styles.item}>• {ex.nome}</Text>
                      <Text style={styles.detalhes}>
                        Séries: {ex.series} | Repetições: {ex.repeticoes} | Carga: {ex.carga_percentual}% | Descanso: {ex.descanso_segundos}s
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        );
      })}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#121212', flexGrow: 1, padding: 20 },
  title: { color: '#fff', fontSize: 22, marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20
  },
  dia: { color: '#4caf50', fontSize: 18, marginBottom: 10 },
  grupo: {
    color: '#ffca28',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16
  },
  item: { color: '#ccc', marginLeft: 10, fontSize: 14 },
  detalhes: {
    color: '#999',
    fontSize: 13,
    marginLeft: 16,
    marginBottom: 6
  },
  voltar: {
    marginTop: 20,
    color: '#bbb',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  headerGrupo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  adicionar: {
    color: '#4caf50',
    fontSize: 14,
    textDecorationLine: 'underline'
  },
  exBox: {
    marginBottom: 8
  }
});
