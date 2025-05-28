import React, { useEffect, useState } from 'react';
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
import { gerarPlano } from '../utils/geradorTreino';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function CreateTrainingScreen() {
  const [plano, setPlano] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const gerarTreino = async () => {
      const anamneseJSON = await AsyncStorage.getItem('@anamnese');
      if (!anamneseJSON) return;

      const anamnese = JSON.parse(anamneseJSON);
      const treinoGerado = gerarPlano(anamnese);
      setPlano(treinoGerado);
    };

    gerarTreino();
  }, []);

  const removerExercicio = (diaIndex, exercicioIndex) => {
    const novoPlano = [...plano];
    novoPlano[diaIndex].exercicios.splice(exercicioIndex, 1);
    setPlano(novoPlano);
  };

  const adicionarExercicio = (diaIndex, novoExercicio) => {
    const novoPlano = [...plano];
    novoPlano[diaIndex].exercicios.push(novoExercicio);
    setPlano(novoPlano);
  };

  const salvarTreino = async () => {
    try {
      const nome = `Treino de ${new Date().toLocaleDateString('pt-BR')}`;
      const novo = {
        nome,
        criadoEm: new Date().toISOString(),
        plano
      };

      const salvosJSON = await AsyncStorage.getItem('@treinos_salvos');
      const salvos = salvosJSON ? JSON.parse(salvosJSON) : [];

      salvos.push(novo);

      await AsyncStorage.setItem('@treinos_salvos', JSON.stringify(salvos));
      Alert.alert('Sucesso', 'Treino salvo no histórico!');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível salvar o treino.');
    }
  };


  const agruparPorGrupo = (exercicios) => {
    const grupos = {};
    for (const ex of exercicios) {
      if (!grupos[ex.grupo_muscular]) grupos[ex.grupo_muscular] = [];
      grupos[ex.grupo_muscular].push(ex);
    }
    return grupos;
  };

  const irParaAdicionar = (diaIndex, grupoSelecionado = null) => {
    AsyncStorage.getItem('@anamnese').then((data) => {
      const localTreino = JSON.parse(data)?.local || 'academia';

      navigation.navigate('AdicionarExercicio', {
        diaIndex,
        grupoSelecionado,
        localTreino,
        exerciciosDoDia: plano[diaIndex].exercicios,
        onAdd: adicionarExercicio
      });
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plano de Treino Gerado</Text>

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

            <TouchableOpacity onPress={() => irParaAdicionar(diaIndex, null)}>
              <Text style={styles.addOutroGrupo}>+ Adicionar exercício de outro grupo</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={styles.saveButton} onPress={salvarTreino}>
        <Text style={styles.saveButtonText}>Salvar no Histórico</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.backText}>← Voltar ao Menu</Text>
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
    fontSize: 24,
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
