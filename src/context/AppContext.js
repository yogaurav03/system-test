import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = React.createContext();

export const AppProvider = ({children}) => {
  const [users, setUsers] = React.useState([]);

  // Load the saved data from AsyncStorage when the component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Save the data to AsyncStorage whenever the users state changes
  useEffect(() => {
    saveData();
  }, [users]);

  // Load the saved data from AsyncStorage
  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('appData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUsers(parsedData.users || []);
      }
    } catch (error) {
      console.log('Error loading data from AsyncStorage:', error);
    }
  };

  // Save the data to AsyncStorage
  const saveData = async () => {
    try {
      const data = JSON.stringify({users});
      await AsyncStorage.setItem('appData', data);
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
  };

  const contextData = {
    users,
    setUsers,
  };

  return (
    <AppContext.Provider value={contextData}>{children}</AppContext.Provider>
  );
};
