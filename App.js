import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AjudaProfissionalScreen from './src/screens/AjudaProfissionalScreen';
import TreinoDoPersonalScreen from './src/screens/TreinoDoPersonalScreen';
import EditarPlanoProfissionalScreen from './src/screens/EditarPlanoProfissionalScreen';
import CriarPlanoProfissionalScreen from './src/screens/CriarPlanoProfissionalScreen';
import GerenciarAlunoScreen from './src/screens/GerenciarAlunoScreen';
import ListaAlunosScreen from './src/screens/ListaAlunosScreen';
import PerfilProfissionalScreen from './src/screens/PerfilProfissionalScreen';
import MenuProfissionalScreen from './src/screens/MenuProfissionalScreen';
import CadastroProfissionalScreen from './src/screens/CadastroProfissionalScreen';
import CadastroAlunoScreen from './src/screens/CadastroAlunoScreen';
import LoginTipoScreen from './src/screens/LoginTipoScreen';
import LoginAlunoScreen from './src/screens/LoginAlunoScreen';
import LoginProfissionalScreen from './src/screens/LoginProfissionalScreen';
import EditarTreinoScreen from './src/screens/EditarTreinoScreen';
import TreinosSalvosScreen from './src/screens/TreinosSalvosScreen';
import AdicionarExercicioScreen from './src/screens/AdicionarExercicioScreen';
import AnamneseScreen from './src/screens/AnamneseScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import TrainingEditorScreen from './src/screens/TrainingEditorScreen';
import CreateTrainingScreen from './src/screens/CreateTrainingScreen';
import NutritionTipsScreen from './src/screens/NutritionTipsScreen';

import { UserProvider } from './src/context/UserContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginTipo" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="LoginTipo" component={LoginTipoScreen} />
          <Stack.Screen name="LoginAluno" component={LoginAlunoScreen} />
          <Stack.Screen name="LoginProfissional" component={LoginProfissionalScreen} />
          <Stack.Screen name="CadastroAluno" component={CadastroAlunoScreen} />
          <Stack.Screen name="CadastroProfissional" component={CadastroProfissionalScreen} />
          <Stack.Screen name="MenuProfissional" component={MenuProfissionalScreen} />
          <Stack.Screen name="PerfilProfissional" component={PerfilProfissionalScreen} />
          <Stack.Screen name="ListaAlunos" component={ListaAlunosScreen} />
          <Stack.Screen name="GerenciarAluno" component={GerenciarAlunoScreen} />
          <Stack.Screen name="CriarPlanoProfissional" component={CriarPlanoProfissionalScreen} />
          <Stack.Screen name="EditarPlanoProfissional" component={EditarPlanoProfissionalScreen} />
          <Stack.Screen name="TreinoDoPersonal" component={TreinoDoPersonalScreen} />
          <Stack.Screen name="AjudaProfissional" component={AjudaProfissionalScreen} />
          <Stack.Screen name="Anamnese" component={AnamneseScreen} />
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
          <Stack.Screen name="TrainingEditor" component={TrainingEditorScreen} />
          <Stack.Screen name="CreateTraining" component={CreateTrainingScreen} />
          <Stack.Screen name="NutritionTips" component={NutritionTipsScreen} />
          <Stack.Screen name="AdicionarExercicio" component={AdicionarExercicioScreen} />
          <Stack.Screen name="TreinosSalvos" component={TreinosSalvosScreen} />
          <Stack.Screen name="EditarTreino" component={EditarTreinoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
