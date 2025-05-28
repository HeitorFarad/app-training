import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);

  // Recupera o nome do usuário salvo ao iniciar o app
  useEffect(() => {
    const loadUser = async () => {
      const storedName = await AsyncStorage.getItem('@user_name');
      if (storedName) {
        setUserName(storedName);
      }
    };
    loadUser();
  }, []);

  const login = async (name) => {
    setUserName(name);
    await AsyncStorage.setItem('@user_name', name);
  };

  const logout = async () => {
    setUserName(null);
    await AsyncStorage.removeItem('@user_name');
  };

  return (
    <UserContext.Provider value={{ userName, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
