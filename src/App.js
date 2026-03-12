import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1>Clinic Management System</h1>
          <p>Welcome to the Clinic Management System</p>
        </header>
      </div>
    </Provider>
  );
}

export default App;
