// src/App.js
import React from 'react';
import DataGrid from './components/DataGrid';
import { mockData } from './data/mockData';
import './App.css';

function App() {
  return (
    <div className="App">
      <header style={{ padding: '20px', textAlign: 'center' }}>
        <h1>AG Grid Excel-like Editable Cells</h1>
        <p>Click on the "Editable Value" column to see inline editing with formula bar sync</p>
      </header>
      <main style={{ padding: '20px' }}>
        <DataGrid data={mockData} />
      </main>
    </div>
  );
}

export default App;
