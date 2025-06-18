import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AjudaProfissionalScreen() {
  const navigation = useNavigation();
  const [profissionais, setProfissionais] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [vinculado, setVinculado] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      const dadosProf = await AsyncStorage.getItem('@profissionais');
      const dadosAluno = await AsyncStorage.getItem('@aluno_logado');
      const vinculos = await AsyncStorage.getItem('@vinculos');

      const lista = dadosProf ? JSON.parse(dadosProf) : [];
      const aluno = dadosAluno ? JSON.parse(dadosAluno) : null;
      const listaVinculos = vinculos ? JSON.parse(vinculos) : [];

      const relacao = listaVinculos.find((v) => v.aluno === aluno?.email);
      const profissionalVinculado = lista.find((p) => p.email === relacao?.profissional)

      setProfissionais(lista);
      setUsuario(aluno);
      setVinculado(profissionalVinculado || null);
    };

    carregar();
  }, []);

  const desvincular = async () => {
    const vinculos = await AsyncStorage.getItem('@vinculos');
    let lista = vinculos ? JSON.parse(vinculos) : [];

    lista = lista.filter((v) => v.aluno !== usuario.email);
    await AsyncStorage.setItem('@vinculos', JSON.stringify(lista));
    setVinculado(null);
    Alert.alert('Pronto!', 'Você se desvinculou do profissional.');
  };

  const vincular = async (profissional) => {
    // verifica anamnese
    const a = await AsyncStorage.getItem(`@anamnese_${usuario.email}`);
    if (!a) {
      Alert.alert('Antes de continuar', 'Responda a anamnese primeiro.');
      return navigation.navigate('Anamnese');
    }

    const vinculos = await AsyncStorage.getItem('@vinculos');
    const lista = vinculos ? JSON.parse(vinculos) : [];

    const novo = {
      aluno: usuario.email,
      profissional: profissional.email
    };

    const atualizados = [
      ...lista.filter((v) => v.aluno !== usuario.email),
      novo
    ];

    await AsyncStorage.setItem('@vinculos', JSON.stringify(atualizados));
    setVinculado(profissional);

    Alert.alert('Sucesso', 'Profissional vinculado!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajuda Profissional</Text>

      {vinculado ? (
        <View style={styles.card}>
          {vinculado.fotoUrl ? (
            <Image source={{ uri: vinculado.fotoUrl }} style={styles.foto} />
          ) : null}
          <Text style={styles.nome}>{vinculado.nome}</Text>
          <Text style={styles.desc}>{vinculado.descricao}</Text>
          <Text style={styles.desc}>📞 {vinculado.celular}</Text>

          <TouchableOpacity onPress={desvincular}>
            <Text style={styles.vincular}>Desvincular</Text>
          </TouchableOpacity>
        </View>
      ) : (
        profissionais.map((p, i) => (
          <View key={i} style={styles.card}>
            {p.fotoUrl ? (
              <Image source={{ uri: p.fotoUrl }} style={styles.foto} />
            ) : null}
            <Text style={styles.nome}>{p.nome}</Text>
            <Text style={styles.desc}>{p.descricao}</Text>
            <Text style={styles.desc}>📞 {p.celular}</Text>

            <TouchableOpacity onPress={() => vincular(p)}>
              <Text style={styles.vincular}>Vincular</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>← Voltar ao Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 20,
    flexGrow: 1
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center'
  },
  alerta: {
    marginBottom: 20,
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 10
  },
  vinculo: {
    color: '#ccc',
    fontSize: 15
  },
  vinculado: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16
  },
  link: {
    color: '#f44336',
    textDecorationLine: 'underline',
    marginTop: 10
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20
  },
  nome: {
    color: '#ffca28',
    fontSize: 16,
    fontWeight: 'bold'
  },
  desc: {
    color: '#ccc',
    marginBottom: 10
  },
  vincular: {
    color: '#4caf50',
    textDecorationLine: 'underline'
  },
  voltar: {
    color: '#bbb',
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline'
  },
  foto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    alignSelf: 'center'
  }
});
