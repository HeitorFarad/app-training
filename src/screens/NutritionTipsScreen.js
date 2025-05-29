import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import recipes from '../data/recipes.json';
import { useNavigation } from '@react-navigation/native';

const categorias = ['Todas', 'Gerais', 'Pré-treino', 'Pós-treino'];

export default function NutritionTipsScreen() {
  const navigation = useNavigation();
  const [filtro, setFiltro] = useState('Todas');
  const [busca, setBusca] = useState('');
  const [listaFiltrada, setListaFiltrada] = useState([]);

  useEffect(() => {
    filtrarReceitas();
  }, [filtro, busca]);

  const filtrarReceitas = () => {
    const termo = busca.toLowerCase();
    let filtradas = recipes;

    if (filtro !== 'Todas') {
      filtradas = filtradas.filter(r => r.categoria === filtro);
    }

    if (busca) {
      filtradas = filtradas.filter(r => r.nome.toLowerCase().includes(termo));
    }

    setListaFiltrada(filtradas);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar ao Menu</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Receitas Fit</Text>

      <TextInput
        placeholder="Buscar por nome..."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={busca}
        onChangeText={setBusca}
      />

      <View style={styles.filtroContainer}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filtroBotao, filtro === cat && styles.filtroSelecionado]}
            onPress={() => setFiltro(cat)}
          >
            <Text style={styles.filtroTexto}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {listaFiltrada.map((r, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.nome}>{r.nome}</Text>
          <Text style={styles.subtitulo}>Ingredientes:</Text>
          {r.ingredientes.map((ing, idx) => (
            <Text key={idx} style={styles.item}>• {ing}</Text>
          ))}

          <Text style={styles.subtitulo}>Modo de preparo:</Text>
          {r.preparo.map((step, idx) => (
            <Text key={idx} style={styles.item}>{idx + 1}. {step}</Text>
          ))}

          <Text style={styles.subtitulo}>Notas Nutricionais:</Text>
          <Text style={styles.item}>{r.notas_nutricionais}</Text>
        </View>
      ))}
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
    fontSize: 22,
    color: '#fff',
    marginBottom: 16
  },
  input: {
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginBottom: 10
  },
  filtroContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20
  },
  filtroBotao: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  filtroSelecionado: {
    backgroundColor: '#4caf50'
  },
  filtroTexto: {
    color: '#fff',
    fontSize: 14
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffca28',
    marginBottom: 10
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4fc3f7',
    marginTop: 10
  },
  item: {
    color: '#ccc',
    fontSize: 14,
    marginLeft: 8
  },
  voltar: {
    marginTop: 20,
    fontSize: 16,
    color: '#bbb',
    textDecorationLine: 'underline',
    textAlign: 'start',
    marginBottom: 8,
  }
});
