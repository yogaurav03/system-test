import React from 'react';
import {AppProvider} from './src/context/AppContext';
import Navigator from './src/navigation/Navigator';

const App = () => {
  return (
    <AppProvider>
      <Navigator />
    </AppProvider>
  );
};

export default App;
