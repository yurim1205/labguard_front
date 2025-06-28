import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ManualUpload from './pages/Manual/ManualUpload';
import AnalyzeDone from './pages/Manual/AnalyzeDone';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManualRead from './pages/Manual/ManualRead';
import RiskAnalyzeResult from './pages/Manual/RiskAnalyzeResult';
import ExperimentMain from './pages/Experiment/ExperimentMain';
import ExperimentChat from './pages/Experiment/ExperimentChat';
import ExperimentContinue from './pages/Experiment/ExperimentContinue';

import ReportMain from './pages/Report/ReportMain';
import ReportRead from './pages/Report/ReportRead';
import AuthLoader from "./components/AuthLoader";

function App() {
  return (
    <Router>
      <AuthLoader />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manual" element={<ManualUpload />} />
        <Route path="/manualUpload" element={<ManualUpload />} />
        <Route path="/AnalyzeDone" element={<AnalyzeDone />} />
        <Route path="/ManualRead" element={<ManualRead />} />
        <Route path="/RiskAnalyzeResult" element={<RiskAnalyzeResult />} />
        <Route path="/ExperimentMain" element={<ExperimentMain />} />
        <Route path="/ExperimentChat" element={<ExperimentChat />} />
        <Route path="/ExperimentChat/:experimentId" element={<ExperimentChat />} />
        <Route path="/ExperimentChat/experiment/:experimentId" element={<ExperimentChat />} />
        <Route path="/ExperimentContinue" element={<ExperimentContinue />} />

        <Route path="/ReportMain" element={<ReportMain />} />
        <Route path="/ReportRead" element={<ReportRead />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;