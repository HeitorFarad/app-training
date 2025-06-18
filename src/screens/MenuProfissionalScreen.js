import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function MenuProfissionalScreen() {
  const navigation = useNavigation();

  const sair = async () => {
    await AsyncStorage.removeItem('@profissional_logado');
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginTipo' }]
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu do Profissional</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('PerfilProfissional')}
      >
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ListaAlunos')}
      >
        <Text style={styles.buttonText}>Ver Alunos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.sair]} onPress={sair}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center'
  },
  sair: {
    backgroundColor: '#f44336'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
