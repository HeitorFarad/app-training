import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

export default function TrainingListScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.backText}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Seus Treinos</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Treino A</Text>
        <Text style={styles.cardText}>Peito / Tríceps / Ombro</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Treino B</Text>
        <Text style={styles.cardText}>Costas / Bíceps</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Treino C</Text>
        <Text style={styles.cardText}>Pernas / Glúteos</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateTraining')}
      >
        <Text style={styles.buttonText}>Criar Novo Treino</Text>
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
  },
  title: {
    fontSize: 26,
    color: '#fff',
    marginBottom: 30,
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 6,
  },
  cardText: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  createButton: {
    marginTop: 20,
    backgroundColor: '#444',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
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
