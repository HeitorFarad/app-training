import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.backText}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Seu Progresso</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cargas</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Supino: 40kg → 60kg</Text>
          <Text style={styles.cardText}>Agachamento: 50kg → 75kg</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Repetições</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Flexão: 10 → 20</Text>
          <Text style={styles.cardText}>Abdominal: 15 → 30</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fotos Antes / Depois</Text>
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120x160.png?text=Antes' }}
            style={styles.photo}
          />
          <Image
            source={{ uri: 'https://via.placeholder.com/120x160.png?text=Depois' }}
            style={styles.photo}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Atualizar Progresso</Text>
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
  section: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#ccc',
    fontSize: 18,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
  },
  cardText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photo: {
    width: width * 0.4,
    height: width * 0.55,
    borderRadius: 10,
    marginRight: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
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
