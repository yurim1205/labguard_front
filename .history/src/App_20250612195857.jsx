import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ManualUpload from './pages/ManualUpload';
import ManualAnalyze from './pages/ManualAnalyze';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manual" element={<ManualUpload />} />
        <Route path="/manualUpload" element={<ManualUpload />} />
        <Route path="/manualAnalyze" element={<ManualAnalyze />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;