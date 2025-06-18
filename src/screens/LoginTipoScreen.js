import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function LoginTipoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Você é:</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginAluno')}
      >
        <Text style={styles.buttonText}>Aluno</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginProfissional')}
      >
        <Text style={styles.buttonText}>Profissional</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 22,
    marginBottom: 30
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 10,
    marginVertical: 10,
    width: 200,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
