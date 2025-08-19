import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import './index.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
