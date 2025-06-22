// ...imports
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function TreinosSalvosScreen() {
  const [treinos, setTreinos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [treinoParaExcluir, setTreinoParaExcluir] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarTreinos();
    });
    return unsubscribe;
  }, [navigation]);

  const carregarTreinos = async () => {
    const user = await AsyncStorage.getItem('@aluno_logado');
    const aluno = user ? JSON.parse(user) : null;
    if (!aluno) return;

    const dados = await AsyncStorage.getItem(`@historico_treinos_${aluno.email}`);
    setTreinos(dados ? JSON.parse(dados) : []);
  };

  const removerTreino = async (id) => {
    const user = await AsyncStorage.getItem('@aluno_logado');
    const aluno = user ? JSON.parse(user) : null;
    if (!aluno) return;

    const atualizados = treinos.filter((t) => t.id !== id);
    setTreinos(atualizados);
    await AsyncStorage.setItem(`@historico_treinos_${aluno.email}`, JSON.stringify(atualizados));
    setModalConfirmacao(false);
  };

  const abrirTreino = (treino) => {
    setTreinoSelecionado(treino);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setTreinoSelecionado(null);
    setModalVisible(false);
  };

  const confirmarRemocao = (treino) => {
    setTreinoParaExcluir(treino);
    setModalConfirmacao(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Treinos Salvos</Text>
      <ScrollView style={{ width: '100%' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>← Voltar ao Menu</Text>
        </TouchableOpacity>

        {treinos.map((t, i) => (
          <View key={t.id} style={styles.card}>
            <Text style={styles.nome}>Treino #{i + 1}</Text>
            <Text style={styles.data}>Criado em: {t.data}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => abrirTreino(t)}>
                <Text style={styles.ver}>👁️ Ver</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmarRemocao(t)}>
                <Text style={styles.remover}>🗑️ Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal de visualização do treino */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Treino</Text>

          {treinoSelecionado?.plano?.map((dia, idx) => (
            <View key={idx} style={styles.diaCard}>
              <Text style={styles.diaNome}>{dia.dia}</Text>
              {dia.exercicios.map((ex, i) => (
                <View key={i} style={styles.exercicioBox}>
                  <Text style={styles.exItem}>• {ex.nome}</Text>
                  <Text style={styles.detalhes}>
                    Séries: {ex.series} | Repetições: {ex.repeticoes} | Carga: {ex.carga_percentual}% | Descanso: {ex.descanso_segundos}s
                  </Text>
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity onPress={fecharModal}>
            <Text style={styles.fechar}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            fecharModal();
            navigation.navigate('EditarTreino', { treino: treinoSelecionado });
          }}>
            <Text style={styles.editar}>✏️ Editar Treino</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal transparent visible={modalConfirmacao} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Confirmar Exclusão</Text>
            <Text style={styles.modalMensagem}>Deseja remover este treino?</Text>
            <View style={{ flexDirection: 'row', gap: 30, marginTop: 20 }}>
              <TouchableOpacity onPress={() => setModalConfirmacao(false)}>
                <Text style={styles.fechar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removerTreino(treinoParaExcluir.id)}>
                <Text style={styles.remover}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// estilos mantidos
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12
  },
  nome: { fontSize: 16, color: '#fff' },
  data: { color: '#aaa', fontSize: 13, marginBottom: 8 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' },
  ver: { color: '#4fc3f7', fontSize: 16 },
  remover: { color: '#f44336', fontSize: 16 },
  modalContainer: { padding: 20, backgroundColor: '#121212' },
  modalTitle: { fontSize: 20, color: '#fff', marginBottom: 16 },
  diaCard: { marginBottom: 16 },
  diaNome: { color: '#4caf50', fontSize: 16, marginBottom: 4 },
  exItem: { color: '#ccc', fontSize: 14, marginLeft: 8 },
  detalhes: { color: '#999', fontSize: 13, marginLeft: 16 },
  fechar: {
    marginTop: 20,
    color: '#bbb',
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  voltar: {
    marginTop: 20,
    color: '#bbb',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'start',
    margin: 10
  },
  editar: {
    marginTop: 12,
    fontSize: 16,
    color: '#4caf50',
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  exercicioBox: {
    marginBottom: 8
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center'
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  modalTitulo: { fontSize: 18, fontWeight: 'bold' },
  modalMensagem: { fontSize: 16, marginTop: 10, textAlign: 'center' }
});
