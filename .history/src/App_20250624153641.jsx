import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import Dashboard from './pages/Dashboard';
import ManualUpload from './pages/Manual/ManualUpload';
import AnalyzeDone from './pages/Manual/AnalyzeDone';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManualRead from './pages/Manual/ManualRead';
import RiskAnalyzeResult from './pages/Manual/RiskAnalyzeResult';
import ExperimentMain from './pages/Experiment/ExperimentMain';
import ExperimentChat from './pages/Experiment/ExperimentChat';
// import ReportMake from './pages/Report/ReportMake';
import ExperimentContinue from './pages/Experiment/ExperimentContinue';
import ReportMain from './pages/Report/ReportMain';
import ReportRead from './pages/Report/ReportRead';
import AuthLoader from "./components/AuthLoader";

function App() {
  const { login, token } = useAuthStore();

  // 앱 시작 시 세션 복원은 AuthLoader에서 처리
  useEffect(() => {
    console.log("🚀 App 컴포넌트 마운트 - AuthLoader가 인증 상태를 확인합니다");
  }, []);

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
        {/* <Route path="/ReportMake" element={<ReportMake />} /> */}
        <Route path="/ExperimentContinue" element={<ExperimentContinue />} />
        <Route path="/ReportMain" element={<ReportMain />} />
        <Route path="/ReportRead" element={<ReportRead />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;