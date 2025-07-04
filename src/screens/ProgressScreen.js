import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function ProgressScreen() {
  const navigation = useNavigation();
  const [treinos, setTreinos] = useState([]);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [progresso, setProgresso] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    carregarTreinos();
  }, []);

  const carregarTreinos = async () => {
    const user = await AsyncStorage.getItem('@aluno_logado');
    const aluno = user ? JSON.parse(user) : null;
    if (!aluno) return;

    const dados = await AsyncStorage.getItem(`@historico_treinos_${aluno.email}`);
    if (dados) {
      setTreinos(JSON.parse(dados));
    }
  };

  const abrirTreino = async (treino, index) => {
    const id = `@progresso_${index}`;
    const salvo = await AsyncStorage.getItem(id);
    setProgresso(salvo ? JSON.parse(salvo) : {});
    setTreinoSelecionado({ treino, index });
  };

  const atualizarCampo = (dia, exNome, campo, valor) => {
    const novo = { ...progresso };
    if (!novo[dia]) novo[dia] = {};
    if (!novo[dia][exNome]) novo[dia][exNome] = { carga: '', reps: '' };
    novo[dia][exNome][campo] = valor;
    setProgresso(novo);
  };

  const salvarProgresso = async () => {
    const id = `@progresso_${treinoSelecionado.index}`;
    await AsyncStorage.setItem(id, JSON.stringify(progresso));
    setModalVisible(true);
  };

  if (!treinoSelecionado) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Progresso dos Treinos</Text>
        <ScrollView style={{ width: '100%' }}>
          {treinos.map((t, i) => (
            <TouchableOpacity
              key={i}
              style={styles.card}
              onPress={() => abrirTreino(t, i)}
            >
              <Text style={styles.nome}>Treino #{i + 1}</Text>
              <Text style={styles.data}>Criado em: {t.data}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>← Voltar ao Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Treino Selecionado</Text>

      {treinoSelecionado.treino.plano.map((dia, diaIndex) => (
        <View key={diaIndex} style={styles.diaCard}>
          <Text style={styles.dia}>{dia.dia}</Text>
          {dia.exercicios.map((ex, i) => (
            <View key={i} style={styles.exBox}>
              <Text style={styles.exNome}>{ex.nome}</Text>
              <Text style={styles.detalhes}>
                Séries: {ex.series} | Repetições: {ex.repeticoes} | Carga estimada: {ex.carga_percentual}% | Descanso: {ex.descanso_segundos}s
              </Text>
              <View style={styles.inputs}>
                <TextInput
                  style={styles.input}
                  placeholder="Carga real (kg)"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={progresso?.[dia.dia]?.[ex.nome]?.carga || ''}
                  onChangeText={(text) => atualizarCampo(dia.dia, ex.nome, 'carga', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Reps feitas"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  value={progresso?.[dia.dia]?.[ex.nome]?.reps || ''}
                  onChangeText={(text) => atualizarCampo(dia.dia, ex.nome, 'reps', text)}
                />
              </View>
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={salvarProgresso}>
        <Text style={styles.saveButtonText}>Salvar Progresso</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setTreinoSelecionado(null)}>
        <Text style={styles.voltar}>← Voltar para Lista</Text>
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>Sucesso!</Text>
            <Text style={styles.modalMensagem}>Progresso salvo com sucesso.</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalFechar}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center'
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
    fontSize: 13
  },
  diaCard: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%'
  },
  dia: {
    fontSize: 18,
    color: '#4caf50',
    marginBottom: 10
  },
  exBox: {
    marginBottom: 12
  },
  exNome: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4
  },
  detalhes: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 6
  },
  inputs: {
    flexDirection: 'row',
    gap: 10
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 8,
    borderRadius: 8,
    width: 130
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16
  },
  voltar: {
    marginTop: 20,
    color: '#bbb',
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalMensagem: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  modalFechar: {
    fontSize: 16,
    color: '#4caf50',
    fontWeight: 'bold'
  }
});
