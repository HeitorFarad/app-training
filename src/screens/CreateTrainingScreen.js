import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function CreateTrainingScreen() {
  const navigation = useNavigation();
  const [plano, setPlano] = useState([]);
  const [alunoEmail, setAlunoEmail] = useState('');

  useEffect(() => {
    carregarPlano();
  }, []);

  const carregarPlano = async () => {
    const user = await AsyncStorage.getItem('@aluno_logado');
    const aluno = user ? JSON.parse(user) : null;
    if (!aluno) return;

    setAlunoEmail(aluno.email);

    const planoSalvo = await AsyncStorage.getItem(`@plano_${aluno.email}`);
    if (planoSalvo) {
      setPlano(JSON.parse(planoSalvo));
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

  const handleSalvarTreino = async () => {
    if (plano.length === 0) {
      Alert.alert('Erro', 'Nenhum plano de treino encontrado para salvar.');
      return;
    }

    const user = await AsyncStorage.getItem('@aluno_logado');
    const aluno = user ? JSON.parse(user) : null;
    if (!aluno) return;

    const historicoRaw = await AsyncStorage.getItem(`@historico_treinos_${aluno.email}`);
    const historico = historicoRaw ? JSON.parse(historicoRaw) : [];

    const novo = {
      id: Date.now(),
      data: new Date().toLocaleDateString(),
      plano
    };

    await AsyncStorage.setItem(
      `@historico_treinos_${aluno.email}`,
      JSON.stringify([...historico, novo])
    );

    Alert.alert('Sucesso', 'Treino salvo no seu histórico!');
  };

  const handleAdicionar = (grupo, diaIndex) => {
    navigation.navigate('AdicionarExercicio', {
      grupo,
      diaIndex,
      email: alunoEmail,
      planoAtual: plano
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Plano de Treino Gerado</Text>

      {plano.length === 0 && (
        <Text style={styles.textoInfo}>
          Nenhum treino encontrado.
        </Text>
      )}

      {plano.map((dia, i) => {
        const grupos = agruparPorGrupo(dia.exercicios);
        return (
          <View key={i} style={styles.card}>
            <Text style={styles.dia}>{dia.dia}</Text>
            {Object.entries(grupos).map(([grupo, exercicios], idx) => (
              <View key={idx}>
                <View style={styles.headerGrupo}>
                  <Text style={styles.grupo}>{grupo}</Text>
                  <TouchableOpacity onPress={() => handleAdicionar(grupo, i)}>
                    <Text style={styles.botaoAdicionar}>+ Adicionar</Text>
                  </TouchableOpacity>
                </View>
                {exercicios.map((ex, j) => (
                  <View key={j} style={styles.exercicioBox}>
                    <Text style={styles.item}>• {ex.nome}</Text>
                    <Text style={styles.detalhes}>
                      Séries: {ex.series} | Repetições: {ex.repeticoes} | Carga: {ex.carga_percentual}% | Descanso: {ex.descanso_segundos}s
                    </Text>
                  </View>
                ))}
              </View>
            ))}
            <TouchableOpacity
              onPress={() => handleAdicionar(null, i)}
              style={styles.btnOutroGrupo}
            >
              <Text style={styles.btnOutroGrupoText}>+ Outro grupo</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.btnSalvar}
        onPress={handleSalvarTreino}
      >
        <Text style={styles.btnSalvarTexto}>💾 Salvar este treino</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.voltar}>← Voltar ao Menu</Text>
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
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center'
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
  grupo: {
    color: '#ffca28',
    fontWeight: 'bold',
    marginTop: 10,
    fontSize: 16
  },
  item: {
    color: '#ccc',
    marginLeft: 10,
    fontSize: 14
  },
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
  botaoAdicionar: {
    color: '#4caf50',
    fontSize: 14,
    textDecorationLine: 'underline'
  },
  btnOutroGrupo: {
    marginTop: 12,
    alignItems: 'flex-start'
  },
  btnOutroGrupoText: {
    color: '#2196f3',
    textDecorationLine: 'underline'
  },
  textoInfo: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 20
  },
  btnSalvar: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  btnSalvarTexto: {
    color: '#fff',
    fontSize: 16
  },
  exercicioBox: {
    marginBottom: 8
  }
});
