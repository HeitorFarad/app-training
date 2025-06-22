import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import exercises from '../data/exercises.json';

export default function AdicionarExercicioScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { diaIndex, grupoSelecionado, localTreino, treinoId } = route.params;

  const [filtroGrupo, setFiltroGrupo] = useState(grupoSelecionado || '');
  const [busca, setBusca] = useState('');
  const [exibidos, setExibidos] = useState([]);

  const [modal, setModal] = useState({ visible: false, titulo: '', mensagem: '' });

  useEffect(() => {
    filtrar();
  }, [filtroGrupo, busca]);

  const filtrar = () => {
    let lista = exercises;

    if (localTreino?.toLowerCase() === 'casa') {
      lista = lista.filter((e) => e.sem_equipamento);
    }

    if (filtroGrupo) {
      lista = lista.filter((e) =>
        e.grupo_muscular.toLowerCase().includes(filtroGrupo.toLowerCase())
      );
    }

    if (busca) {
      lista = lista.filter((e) =>
        e.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    setExibidos(lista);
  };

  const handleAdicionar = async (exercicio) => {
    const aluno = await AsyncStorage.getItem('@aluno_logado');
    const email = JSON.parse(aluno)?.email;
    if (!email) return;

    if (treinoId) {
      const dados = await AsyncStorage.getItem(`@historico_treinos_${email}`);
      const lista = dados ? JSON.parse(dados) : [];

      const index = lista.findIndex((t) => t.id === treinoId);
      if (index === -1) {
        setModal({ visible: true, titulo: 'Erro', mensagem: 'Treino não encontrado.' });
        return;
      }

      const treino = lista[index];
      const dia = treino.plano[diaIndex];

      const existe = dia.exercicios.some((e) => e.nome === exercicio.nome);
      if (existe) {
        setModal({ visible: true, titulo: 'Já adicionado', mensagem: 'Este exercício já está no treino.' });
        return;
      }

      dia.exercicios.push(exercicio);
      treino.plano[diaIndex] = dia;
      lista[index] = treino;

      await AsyncStorage.setItem(`@historico_treinos_${email}`, JSON.stringify(lista));
    } else {
      const planoSalvo = await AsyncStorage.getItem(`@plano_${email}`);
      const plano = planoSalvo ? JSON.parse(planoSalvo) : [];
      const dia = plano[diaIndex];

      const existe = dia.exercicios.some((e) => e.nome === exercicio.nome);
      if (existe) {
        setModal({ visible: true, titulo: 'Já adicionado', mensagem: 'Este exercício já está no treino.' });
        return;
      }

      dia.exercicios.push(exercicio);
      plano[diaIndex] = dia;

      await AsyncStorage.setItem(`@plano_${email}`, JSON.stringify(plano));
    }

    setModal({ visible: true, titulo: 'Sucesso', mensagem: 'Exercício adicionado com sucesso.' });
  };

  const gruposUnicos = [...new Set(exercises.map((e) => e.grupo_muscular))];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Exercício</Text>

      <TextInput
        placeholder="Buscar por nome"
        placeholderTextColor="#aaa"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />

      <FlatList
        data={gruposUnicos}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.grupos}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.grupoBotao,
              filtroGrupo === item && styles.grupoSelecionado
            ]}
            onPress={() =>
              setFiltroGrupo((prev) => (prev === item ? '' : item))
            }
          >
            <Text style={styles.grupoTexto}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={exibidos}
        keyExtractor={(item, index) => item.nome + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleAdicionar(item)}
          >
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.grupo}>{item.grupo_muscular}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ color: '#aaa', textAlign: 'center', marginTop: 20 }}>
            Nenhum exercício encontrado.
          </Text>
        }
      />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Cancelar</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={modal.visible}
        animationType="fade"
        onRequestClose={() => setModal({ ...modal, visible: false })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>{modal.titulo}</Text>
            <Text style={styles.modalMensagem}>{modal.mensagem}</Text>
            <TouchableOpacity
              onPress={() => {
                setModal({ ...modal, visible: false });
                if (modal.titulo === 'Sucesso') navigation.goBack();
              }}
            >
              <Text style={styles.fechar}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#121212', flex: 1, padding: 20 },
  titulo: { fontSize: 20, color: '#fff', marginBottom: 10, textAlign: 'center' },
  input: {
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
    marginBottom: 10
  },
  grupos: { marginBottom: 12 },
  grupoBotao: {
    backgroundColor: '#2c2c2c',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8
  },
  grupoSelecionado: { backgroundColor: '#4caf50' },
  grupoTexto: { color: '#fff', fontSize: 14 },
  item: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  nome: { color: '#fff', fontSize: 16 },
  grupo: { color: '#aaa', fontSize: 13 },
  voltar: {
    color: '#bbb',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline'
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center'
  },
  modalBox: {
    backgroundColor: '#fff', padding: 20, borderRadius: 10,
    width: '80%', alignItems: 'center'
  },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalMensagem: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  fechar: { fontSize: 16, color: '#4caf50', fontWeight: 'bold' }
});
