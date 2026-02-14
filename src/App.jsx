// src/App.jsx (VERSÃO CORRETA)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // A única importação de componente/página que ele faz
import './App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;