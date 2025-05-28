import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditarTreinoScreen from './src/screens/EditarTreinoScreen';
import TreinosSalvosScreen from './src/screens/TreinosSalvosScreen';
import AdicionarExercicioScreen from './src/screens/AdicionarExercicioScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
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
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
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
