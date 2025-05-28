import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function EditarTreinoScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { treinoIndex, treinoOriginal } = route.params;
  const [plano, setPlano] = useState([...treinoOriginal.plano]);

  const removerExercicio = (diaIndex, exercicioIndex) => {
    const novoPlano = [...plano];
    novoPlano[diaIndex].exercicios.splice(exercicioIndex, 1);
    setPlano(novoPlano);
  };

  const adicionarExercicio = (diaIndex, novoEx) => {
    const jaExiste = plano[diaIndex].exercicios.some((e) => e.nome === novoEx.nome);
    if (jaExiste) {
      Alert.alert('Já adicionado', 'Esse exercício já está no treino.');
      return;
    }

    const novoPlano = [...plano];
    novoPlano[diaIndex].exercicios.push(novoEx);
    setPlano(novoPlano);
  };

  const salvarAlteracoes = async () => {
    try {
      const dados = await AsyncStorage.getItem('@treinos_salvos');
      let treinos = dados ? JSON.parse(dados) : [];

      treinos[treinoIndex].plano = plano;
      await AsyncStorage.setItem('@treinos_salvos', JSON.stringify(treinos));

      Alert.alert('Sucesso', 'Treino atualizado!');
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  const irParaAdicionar = (diaIndex, grupoSelecionado = null) => {
    const local = treinoOriginal.local || 'academia'; // fallback

    navigation.navigate('AdicionarExercicio', {
      diaIndex,
      grupoSelecionado,
      localTreino: local,
      exerciciosDoDia: plano[diaIndex].exercicios,
      onAdd: adicionarExercicio
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
      <Text style={styles.title}>Editar {treinoOriginal.nome}</Text>

      {plano.map((dia, diaIndex) => {
        const grupos = agruparPorGrupo(dia.exercicios);

        return (
          <View key={dia.dia} style={styles.card}>
            <Text style={styles.dia}>{dia.dia}</Text>

            {Object.entries(grupos).map(([grupo, exercicios], i) => (
              <View key={i} style={styles.grupoBox}>
                <View style={styles.grupoHeader}>
                  <Text style={styles.grupoNome}>{grupo}</Text>
                  <TouchableOpacity onPress={() => irParaAdicionar(diaIndex, grupo)}>
                    <Text style={styles.addBtn}>➕</Text>
                  </TouchableOpacity>
                </View>

                {exercicios.map((ex, exIndex) => (
                  <View key={exIndex} style={styles.exItem}>
                    <View style={styles.exHeader}>
                      <Text style={styles.exNome}>• {ex.nome}</Text>
                      <TouchableOpacity onPress={() => removerExercicio(diaIndex, dia.exercicios.indexOf(ex))}>
                        <Text style={styles.remover}>Remover</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.exDesc}>{ex.descricao}</Text>
                  </View>
                ))}
              </View>
            ))}

            <TouchableOpacity onPress={() => irParaAdicionar(diaIndex)}>
              <Text style={styles.addOutroGrupo}>+ Adicionar exercício de outro grupo</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={styles.saveButton} onPress={salvarAlteracoes}>
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Voltar</Text>
      </TouchableOpacity>
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
    color: '#fff',
    fontSize: 22,
    marginBottom: 20
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20
  },
  dia: {
    color: '#4caf50',
    fontSize: 18,
    marginBottom: 10
  },
  grupoBox: {
    marginBottom: 10
  },
  grupoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  grupoNome: {
    color: '#ffca28',
    fontSize: 16,
    fontWeight: 'bold'
  },
  addBtn: {
    color: '#4caf50',
    fontSize: 18
  },
  exItem: {
    marginBottom: 10
  },
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  exNome: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  exDesc: {
    color: '#ccc',
    fontSize: 13
  },
  remover: {
    color: '#f44336',
    fontSize: 14,
    textDecorationLine: 'underline'
  },
  addOutroGrupo: {
    marginTop: 10,
    fontSize: 14,
    color: '#4fc3f7',
    textDecorationLine: 'underline'
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16
  },
  backText: {
    color: '#bbb',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginTop: 20
  }
});
