// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BuscarPaciente from './pages/BuscarPaciente';
import RegistroPaciente from './pages/RegistroPaciente';
import RegistroPacienteExterno from './pages/RegistroPacienteExterno';
import HistorialPaciente from './pages/HistorialPaciente';
import NuevaSesion from './pages/NuevaSesion';
import EntrevistaOrientacionVocacional from './pages/EntrevistaOrientacionVocacional'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/buscar-paciente" replace />} />
          <Route path="/buscar-paciente" element={<BuscarPaciente />} />
          <Route path="/registro-paciente" element={<RegistroPaciente />} />
          <Route path="/registro-paciente-externo" element={<RegistroPacienteExterno />} />
          <Route path="/pacientes/:id/historial" element={<HistorialPaciente />} />
          <Route path="/pacientes/:id/nueva-sesion" element={<NuevaSesion />} />
          <Route path="/pacientes-externos/:id/orientacion-vocacional" element={<EntrevistaOrientacionVocacional />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;