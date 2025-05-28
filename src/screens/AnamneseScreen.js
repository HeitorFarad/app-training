import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const objetivos = ['perder peso', 'hipertrofia', 'força', 'potência', 'saúde'];
const locais = ['casa', 'academia'];
const niveis = ['sedentário', 'pouco ativo', 'ativo'];
const possuiLesao = ['sim', 'não'];
const regioesLesao = ['joelho', 'tornozelo', 'ombro', 'coluna', 'braço', 'perna', 'outro'];
const frequencias = ['1', '2', '3', '4', '5', '6', '7'];

export default function AnamneseScreen({ navigation }) {
  const [form, setForm] = useState({
    objetivo: '',
    local: '',
    idade: '',
    peso: '',
    altura: '',
    nivel: '',
    lesao: '',
    regiaoLesao: '',
    frequencia: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const camposObrigatorios = ['objetivo', 'local', 'idade', 'peso', 'altura', 'nivel', 'frequencia'];

    for (let campo of camposObrigatorios) {
      if (!form[campo]) {
        Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
        return;
      }
    }

    try {
      await AsyncStorage.setItem('@anamnese', JSON.stringify(form));
      Alert.alert('Sucesso', 'Anamnese salva com sucesso!');
      navigation.navigate('CreateTraining');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Falha ao salvar anamnese.');
    }
  };

  const renderSelect = (label, key, options) => (
    <View style={styles.selectGroup}>
      <Text style={styles.selectLabel}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              form[key] === option && styles.optionSelected,
            ]}
            onPress={() => handleChange(key, option)}
          >
            <Text
              style={[
                styles.optionText,
                form[key] === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.backText}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Anamnese</Text>

      {renderSelect('Objetivo', 'objetivo', objetivos)}
      {renderSelect('Local de treino', 'local', locais)}

      <TextInput
        placeholder="Idade"
        placeholderTextColor="#888"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(value) => handleChange('idade', value)}
      />

      <TextInput
        placeholder="Peso (kg)"
        placeholderTextColor="#888"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(value) => handleChange('peso', value)}
      />

      <TextInput
        placeholder="Altura (cm)"
        placeholderTextColor="#888"
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(value) => handleChange('altura', value)}
      />

      {renderSelect('Nível de atividade física', 'nivel', niveis)}
      {renderSelect('Possui lesão?', 'lesao', possuiLesao)}

      {form.lesao === 'sim' && renderSelect('Região da lesão', 'regiaoLesao', regioesLesao)}
      {renderSelect('Dias na semana para treinar', 'frequencia', frequencias)}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Salvar Anamnese</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: width * 0.9,
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10,
    color: '#fff',
    marginBottom: 16,
  },
  selectGroup: {
    width: width * 0.9,
    marginBottom: 20,
  },
  selectLabel: {
    color: '#ccc',
    marginBottom: 8,
    fontSize: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#4caf50',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
  },
  optionTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.9,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
  marginTop: 20,
  alignSelf: 'flex-start',
},
  backText: {
  color: '#bbb',
  fontSize: 16,
  textDecorationLine: 'underline',
},

});
