import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditarTreinoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const treino = route.params?.treino;

  const [plano, setPlano] = useState(treino?.plano || []);
  const [treinoId] = useState(treino?.id || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [exercicioParaRemover, setExercicioParaRemover] = useState(null);

  useEffect(() => {
    if (!treino || !treino.plano || !treino.id) {
      navigation.goBack();
    }
  }, []);

  const confirmarRemocao = (diaIndex, nome) => {
    setExercicioParaRemover({ diaIndex, nome });
    setModalVisible(true);
  };

  const removerExercicio = async () => {
    const { diaIndex, nome } = exercicioParaRemover;
    const novoPlano = [...plano];
    const dia = novoPlano[diaIndex];
    dia.exercicios = dia.exercicios.filter((e) => e.nome !== nome);
    novoPlano[diaIndex] = dia;
    setPlano(novoPlano);
    setModalVisible(false);

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
      localTreino: 'academia', // ou use o valor real da anamnese
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
                    onPress={() => confirmarRemocao(i, ex.nome)}
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

      {/* Modal de confirmação */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              Deseja remover o exercício "{exercicioParaRemover?.nome}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={removerExercicio}>
                <Text style={styles.confirmar}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%'
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelar: {
    color: 'gray',
    fontSize: 16
  },
  confirmar: {
    color: 'red',
    fontSize: 16
  }
});
