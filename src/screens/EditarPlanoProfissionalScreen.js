import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditarPlanoProfissionalScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { aluno, plano } = route.params;

  const [planoEditado, setPlanoEditado] = useState([...plano]);

  const removerExercicio = (diaIndex, exercicioIndex) => {
    const novoPlano = [...planoEditado];
    novoPlano[diaIndex].exercicios.splice(exercicioIndex, 1);
    setPlanoEditado(novoPlano);
  };

  const adicionarExercicio = (diaIndex, novoEx) => {
    const jaExiste = planoEditado[diaIndex].exercicios.some((e) => e.nome === novoEx.nome);
    if (jaExiste) {
      Alert.alert('Já adicionado', 'Esse exercício já está no treino.');
      return;
    }

    const novoPlano = [...planoEditado];
    novoPlano[diaIndex].exercicios.push(novoEx);
    setPlanoEditado(novoPlano);
  };

  const irParaAdicionar = (diaIndex, grupoSelecionado = null) => {
    const localTreino = 'academia'; // assume academia para personal

    navigation.navigate('AdicionarExercicio', {
      diaIndex,
      grupoSelecionado,
      localTreino,
      exerciciosDoDia: planoEditado[diaIndex].exercicios,
      onAdd: adicionarExercicio
    });
  };

  const salvarAlteracoes = async () => {
    await AsyncStorage.setItem(`@plano_${aluno.email}`, JSON.stringify(planoEditado));
    Alert.alert('Sucesso', 'Plano atualizado com sucesso!');
    navigation.goBack();
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
      <Text style={styles.title}>Editar Plano de {aluno.nome}</Text>

      {planoEditado.map((dia, diaIndex) => {
        const grupos = agruparPorGrupo(dia.exercicios);

        return (
          <View key={diaIndex} style={styles.card}>
            <Text style={styles.dia}>{dia.dia}</Text>

            {Object.entries(grupos).map(([grupo, exercicios], idx) => (
              <View key={idx}>
                <View style={styles.grupoHeader}>
                  <Text style={styles.grupo}>{grupo}</Text>
                  <TouchableOpacity onPress={() => irParaAdicionar(diaIndex, grupo)}>
                    <Text style={styles.add}>➕</Text>
                  </TouchableOpacity>
                </View>
                {exercicios.map((ex, i) => (
                  <View key={i} style={styles.exItem}>
                    <Text style={styles.exNome}>• {ex.nome}</Text>
                    <TouchableOpacity onPress={() => removerExercicio(diaIndex, dia.exercicios.indexOf(ex))}>
                      <Text style={styles.remover}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}

            <TouchableOpacity onPress={() => irParaAdicionar(diaIndex)}>
              <Text style={styles.addOutro}>+ Adicionar de outro grupo</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>

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
    fontSize: 20,
    marginBottom: 20
  },
  card: {
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
  grupoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  grupo: {
    color: '#ffca28',
    fontSize: 16,
    fontWeight: 'bold'
  },
  add: {
    color: '#4caf50',
    fontSize: 18
  },
  exItem: {
    marginLeft: 10,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  exNome: {
    color: '#fff',
    fontSize: 14
  },
  remover: {
    color: '#f44336',
    fontSize: 14,
    marginLeft: 12
  },
  addOutro: {
    marginTop: 10,
    color: '#4fc3f7',
    textDecorationLine: 'underline'
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  voltar: {
    marginTop: 20,
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});
