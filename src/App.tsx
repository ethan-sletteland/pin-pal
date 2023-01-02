import React from 'react';
// import { Counter } from './features/counter/Counter';
import './App.css';
import { Library } from './features/counter/Library';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pin Pal</h1>
        <Library />

      </header>
    </div>
  );
}

export default App;
