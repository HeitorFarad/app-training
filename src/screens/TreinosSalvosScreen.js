import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function TreinosSalvosScreen() {
  const [treinos, setTreinos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    carregarTreinos();
  }, []);

  const carregarTreinos = async () => {
    const dados = await AsyncStorage.getItem('@treinos_salvos');
    if (dados) setTreinos(JSON.parse(dados));
  };

  const removerTreino = async (index) => {
    const novos = [...treinos];
    novos.splice(index, 1);
    await AsyncStorage.setItem('@treinos_salvos', JSON.stringify(novos));
    setTreinos(novos);
  };

  const abrirTreino = (treino) => {
    setTreinoSelecionado(treino);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setTreinoSelecionado(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Treinos Salvos</Text>
      <ScrollView style={{ width: '100%' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.voltar}>← Voltar ao Menu</Text>
        </TouchableOpacity>

        {treinos.map((t, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.nome}>{t.nome}</Text>
            <Text style={styles.data}>Criado em: {new Date(t.criadoEm).toLocaleDateString('pt-BR')}</Text>

            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => abrirTreino(t)}>
                <Text style={styles.ver}>👁️ Ver</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() =>
                Alert.alert('Confirmar', 'Remover este treino?', [
                  { text: 'Cancelar' },
                  { text: 'Remover', onPress: () => removerTreino(i) }
                ])
              }>
                <Text style={styles.remover}>🗑️ Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal para exibir conteúdo do treino */}
      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>{treinoSelecionado?.nome}</Text>

          {treinoSelecionado?.plano?.map((dia, idx) => (
            <View key={idx} style={styles.diaCard}>
              <Text style={styles.diaNome}>{dia.dia}</Text>
              {dia.exercicios.map((ex, i) => (
                <Text key={i} style={styles.exItem}>• {ex.nome}</Text>
              ))}
            </View>
          ))}

          <TouchableOpacity onPress={fecharModal}>
            <Text style={styles.fechar}>← Voltar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            fecharModal();
            navigation.navigate('EditarTreino', {
              treinoIndex: treinos.indexOf(treinoSelecionado),
              treinoOriginal: treinoSelecionado
            });
          }}>
            <Text style={styles.editar}>✏️ Editar Treino</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

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
  nome: {
    fontSize: 16,
    color: '#fff'
  },
  data: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 8
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ver: {
    color: '#4fc3f7',
    fontSize: 16
  },
  remover: {
    color: '#f44336',
    fontSize: 16
  },
  modalContainer: {
    padding: 20,
    backgroundColor: '#121212'
  },
  modalTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 16
  },
  diaCard: {
    marginBottom: 16
  },
  diaNome: {
    color: '#4caf50',
    fontSize: 16,
    marginBottom: 4
  },
  exItem: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 8
  },
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
  margin: 10,
  },
  editar: {
  marginTop: 12,
  fontSize: 16,
  color: '#4caf50',
  textAlign: 'center',
  textDecorationLine: 'underline'
  }
});
