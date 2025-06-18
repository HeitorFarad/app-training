import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const opcoes = {
  objetivo: ['Perder peso', 'Hipertrofia', 'Ganhar força', 'Potência', 'Saúde no geral'],
  local: ['Casa', 'Academia'],
  nivel: ['Sedentário', 'Pouco ativo', 'Ativo'],
  lesao: ['Não', 'Sim'],
  localLesao: ['Tornozelo', 'Joelho', 'Quadríceps', 'Posterior', 'Glúteo'],
  frequencia: ['1', '2', '3', '4', '5', '6', '7']
};

export default function AnamneseScreen() {
  const navigation = useNavigation();
  const [respostas, setRespostas] = useState({
    objetivo: '',
    local: '',
    idade: '',
    peso: '',
    altura: '',
    nivel: '',
    lesao: '',
    localLesao: '',
    frequencia: ''
  });

  const route = useRoute();
  const gerarPlanoAoFinalizar = route.params?.gerarPlano || false;

  const handleChange = (campo, valor) => {
    setRespostas((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleFinalizar = async () => {
    const aluno = JSON.parse(await AsyncStorage.getItem('@aluno_logado'));
    if (!aluno) return;

    await AsyncStorage.setItem(`@anamnese_${aluno.email}`, JSON.stringify(respostas));

    const vinculos = await AsyncStorage.getItem('@vinculos');
    const listaVinculos = vinculos ? JSON.parse(vinculos) : [];
    const estaVinculado = listaVinculos.some((v) => v.aluno === aluno.email);

    if (gerarPlanoAoFinalizar) {
      // Sempre gera o plano se veio do botão "Criar Treino"
      const { gerarPlano } = require('../utils/geradorTreino');
      const plano = gerarPlano(respostas);
      await AsyncStorage.setItem(`@plano_${aluno.email}`, JSON.stringify(plano));
      Alert.alert('Sucesso', 'Plano criado com base na sua nova anamnese.');
      navigation.navigate('CreateTraining');
      return;
    }

    // Se veio de outra tela (exemplo: vinculação com personal)
    if (estaVinculado) {
      Alert.alert('Anamnese salva!', 'Seu personal poderá criar seu plano.');
    } else {
      Alert.alert('Anamnese salva!', 'Agora você pode criar seu plano de treino.');
    }

    navigation.navigate('MainMenu');
  };

  const renderBotoes = (campo) => {
    return (
      <View style={styles.opcoesContainer}>
        {opcoes[campo].map((op, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.opcao,
              respostas[campo] === op && styles.opcaoSelecionada
            ]}
            onPress={() => handleChange(campo, op)}
          >
            <Text style={styles.opcaoTexto}>{op}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Anamnese</Text>

      <Text style={styles.label}>Objetivo</Text>
      {renderBotoes('objetivo')}

      <Text style={styles.label}>Local de treino</Text>
      {renderBotoes('local')}

      <TextInput
        placeholder="Idade"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        style={styles.input}
        value={respostas.idade}
        onChangeText={(v) => handleChange('idade', v)}
      />
      <TextInput
        placeholder="Peso (kg)"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        style={styles.input}
        value={respostas.peso}
        onChangeText={(v) => handleChange('peso', v)}
      />
      <TextInput
        placeholder="Altura (cm)"
        placeholderTextColor="#aaa"
        keyboardType="numeric"
        style={styles.input}
        value={respostas.altura}
        onChangeText={(v) => handleChange('altura', v)}
      />

      <Text style={styles.label}>Nível de atividade</Text>
      {renderBotoes('nivel')}

      <Text style={styles.label}>Possui lesão?</Text>
      {renderBotoes('lesao')}

      {respostas.lesao === 'Sim' && (
        <>
          <Text style={styles.label}>Local da lesão</Text>
          {renderBotoes('localLesao')}
        </>
      )}

      <Text style={styles.label}>Frequência semanal</Text>
      {renderBotoes('frequencia')}

      <TouchableOpacity style={styles.button} onPress={handleFinalizar}>
        <Text style={styles.buttonText}>Finalizar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flexGrow: 1
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center'
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4
  },
  input: {
    backgroundColor: '#1f1f1f',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12
  },
  opcoesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  opcao: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    margin: 5
  },
  opcaoSelecionada: {
    backgroundColor: '#4caf50'
  },
  opcaoTexto: {
    color: '#fff'
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
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
