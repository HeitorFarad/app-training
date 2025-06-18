import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function TreinoDoPersonalScreen() {
  const navigation = useNavigation();
  const [plano, setPlano] = useState([]);
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const user = await AsyncStorage.getItem('@aluno_logado');
      if (!user) return;

      const alunoData = JSON.parse(user);
      setAluno(alunoData);

      const planoSalvo = await AsyncStorage.getItem(`@plano_${alunoData.email}`);
      if (planoSalvo) setPlano(JSON.parse(planoSalvo));
    };

    carregar();
  }, []);

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
      <Text style={styles.title}>Treino Criado pelo Personal</Text>

      {plano.length === 0 ? (
        <Text style={styles.msg}>Nenhum plano criado ainda.</Text>
      ) : (
        plano.map((dia, i) => {
          const grupos = agruparPorGrupo(dia.exercicios);
          return (
            <View key={i} style={styles.card}>
              <Text style={styles.dia}>{dia.dia}</Text>
              {Object.entries(grupos).map(([grupo, exercicios], idx) => (
                <View key={idx}>
                  <Text style={styles.grupo}>{grupo}</Text>
                  {exercicios.map((ex, j) => (
                    <Text key={j} style={styles.item}>• {ex.nome}</Text>
                  ))}
                </View>
              ))}
            </View>
          );
        })
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar ao Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 20,
    flexGrow: 1
  },
  title: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center'
  },
  msg: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40
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
    marginTop: 6
  },
  item: {
    color: '#ccc',
    marginLeft: 10,
    fontSize: 14
  },
  voltar: {
    marginTop: 20,
    textAlign: 'center',
    color: '#bbb',
    fontSize: 16,
    textDecorationLine: 'underline'
  }
});
