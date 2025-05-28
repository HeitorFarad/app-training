import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { UserContext } from '../context/UserContext';

const { width } = Dimensions.get('window');

export default function MainMenuScreen({ navigation }) {
  const { userName, logout } = useContext(UserContext);

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        onPress: () => {
          logout();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Inicial</Text>
      {userName && <Text style={styles.subTitle}>Olá, {userName}!</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Anamnese')}
      >
        <Text style={styles.buttonText}>Criar Treino</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Progress')}>
        <Text style={styles.buttonText}>Ver Progresso</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NutritionTips')}>
        <Text style={styles.buttonText}>Ver Dicas de Alimentação</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TreinosSalvos')}
      >
        <Text style={styles.buttonText}>Ver Treinos Salvos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    color: '#bbb',
    marginBottom: 30,
  },
  button: {
    width: width * 0.85,
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    width: width * 0.85,
    backgroundColor: '#b22222',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
