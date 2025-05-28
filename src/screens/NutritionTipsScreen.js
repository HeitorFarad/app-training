import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function NutritionTipsScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.backText}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Dicas de Alimentação</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💧 Beba bastante água</Text>
        <Text style={styles.cardText}>Mantenha-se hidratado ao longo do dia, especialmente antes e depois dos treinos.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🍽️ Divida bem as refeições</Text>
        <Text style={styles.cardText}>Procure fazer de 5 a 6 refeições ao dia para manter o metabolismo ativo.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🥦 Prefira alimentos naturais</Text>
        <Text style={styles.cardText}>Frutas, legumes, grãos e proteínas magras ajudam no desempenho e na recuperação.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚖️ Ajuste a dieta ao seu objetivo</Text>
        <Text style={styles.cardText}>Ganhar massa, emagrecer ou manter — cada meta exige uma estratégia alimentar específica.</Text>
      </View>
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
    marginBottom: 8,
  },
  cardText: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
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
