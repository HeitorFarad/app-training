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
import { useRoute, useNavigation } from '@react-navigation/native';
import { gerarPlano } from '../utils/geradorTreino';

export default function CriarPlanoProfissionalScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { aluno } = route.params;

  const [plano, setPlano] = useState([]);
  const [anamnese, setAnamnese] = useState(null);

  useEffect(() => {
    const gerar = async () => {
      const aJSON = await AsyncStorage.getItem(`@anamnese_${aluno.email}`);
      if (!aJSON) {
        Alert.alert('Erro', 'Aluno ainda não possui anamnese.');
        navigation.goBack();
        return;
      }

      const dados = JSON.parse(aJSON);
      setAnamnese(dados);
      const treinoGerado = gerarPlano(dados);
      setPlano(treinoGerado);
    };

    gerar();
  }, []);

  const salvarPlano = async () => {
    await AsyncStorage.setItem(`@plano_${aluno.email}`, JSON.stringify(plano));
    Alert.alert('Sucesso', 'Plano salvo com sucesso!');
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
      <Text style={styles.title}>Criar Plano para: {aluno.nome}</Text>

      {plano.map((dia, i) => {
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
      })}

      <TouchableOpacity style={styles.button} onPress={salvarPlano}>
        <Text style={styles.buttonText}>Salvar Plano</Text>
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
    borderRadius: 10,
    padding: 16,
    marginBottom: 20
  },
  dia: {
    color: '#4caf50',
    fontSize: 18,
    marginBottom: 8
  },
  grupo: {
    color: '#ffca28',
    fontWeight: 'bold',
    marginTop: 8
  },
  item: {
    color: '#ccc',
    marginLeft: 10,
    fontSize: 14
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  voltar: {
    marginTop: 20,
    color: '#bbb',
    textAlign: 'center',
    textDecorationLine: 'underline'
  }
});
