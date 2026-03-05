import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BuscarPaciente from './pages/BuscarPaciente';
import RegistroPaciente from './pages/RegistroPaciente';
import RegistroPacienteExterno from './pages/RegistroPacienteExterno';
import HistorialPaciente from './pages/HistorialPaciente';
import NuevaSesion from './pages/NuevaSesion';
import DetalleSesion from './pages/DetalleSesion';
import DetalleOrientacionVocacional from './pages/DetalleOrientacionVocacional';
import EntrevistaOrientacionVocacional from './pages/EntrevistaOrientacionVocacional';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/buscar-paciente" element={<BuscarPaciente />} />
        <Route path="/registro-paciente" element={<RegistroPaciente />} />
        <Route path="/registro-paciente-externo" element={<RegistroPacienteExterno />} />
        <Route path="/pacientes/:id/historial" element={<HistorialPaciente />} />
        <Route path="/pacientes/:id/nueva-sesion" element={<NuevaSesion />} />
        <Route path="/sesiones/:id" element={<DetalleSesion />} />
        <Route path="/pacientes-externos/:id/detalle-orientacion" element={<DetalleOrientacionVocacional />} />
        <Route path="/pacientes-externos/:id/orientacion-vocacional" element={<EntrevistaOrientacionVocacional />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
