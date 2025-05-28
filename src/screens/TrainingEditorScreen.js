import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

export default function TrainingEditorScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Treino</Text>

      <View style={styles.exerciseCard}>
        <Text style={styles.label}>Exercício</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do exercício"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Séries</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 3"
          placeholderTextColor="#888"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Repetições</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 12"
          placeholderTextColor="#888"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Carga (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 30"
          placeholderTextColor="#888"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Adicionar Exercício</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Salvar Treino</Text>
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
  exerciseCard: {
    width: width * 0.9,
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    color: '#ccc',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: '#444',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.9,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 10,
    width: width * 0.9,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
