import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function FavoriteTrainingScreen() {
  const navigation = useNavigation();
  const [treino, setTreino] = useState(null); // null = ainda carregando

  useEffect(() => {
    const carregarFavorito = async () => {
      const json = await AsyncStorage.getItem('@treino_favorito');
      setTreino(json ? JSON.parse(json) : []);
    };
    carregarFavorito();
  }, []);

  const apagarTreino = async () => {
    Alert.alert('Apagar Treino', 'Deseja mesmo apagar o treino favorito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        onPress: async () => {
          await AsyncStorage.removeItem('@treino_favorito');
          setTreino([]);
          Alert.alert('Removido', 'Treino apagado com sucesso.');
        },
      },
    ]);
  };

  if (treino === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando treino favorito...</Text>
      </View>
    );
  }

  if (treino.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhum treino favorito salvo.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MainMenu')}>
          <Text style={styles.backText}>← Voltar ao Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu')}>
        <Text style={styles.backText}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Treino Favorito</Text>

      {treino.map((dia, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.dia}>{dia.dia} - {dia.grupoMuscular}</Text>
          {dia.exercicios.map((ex, index) => (
            <View key={index} style={styles.exItem}>
              <Text style={styles.exNome}>• {ex.nome}</Text>
              <Text style={styles.exDesc}>{ex.descricao}</Text>
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.buttonApagar} onPress={apagarTreino}>
        <Text style={styles.buttonText}>Apagar Treino</Text>
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
    paddingBottom: 40
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20
  },
  card: {
    width: width * 0.9,
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
  exItem: {
    marginBottom: 12
  },
  exNome: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  exDesc: {
    color: '#ccc',
    fontSize: 14
  },
  buttonApagar: {
    backgroundColor: '#b22222',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
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
