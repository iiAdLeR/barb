import React from 'react';
import SimpleApp from './SimpleApp';

function App() {
  console.log('App component loaded - using SimpleApp');
  
  return (
    <div className="App">
      <SimpleApp />
    </div>
  );
}

export default App;