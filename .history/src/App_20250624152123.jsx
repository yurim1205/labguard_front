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


function App() {
  const { login, token } = useAuthStore();

  // 앱 시작 시 세션 복원
  useEffect(() => {
    const restoreSession = async () => {
      try {
        console.log("Attempting to restore session...");
        
        // 저장된 토큰이 있으면 사용
        const headers = {
          "Content-Type": "application/json",
        };
        
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
        
        const response = await fetch("/api/user/me", {
          method: "GET",
          headers: headers,
          credentials: "include", // 쿠키 포함
        });

        console.log("Session restore response status:", response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log("Restored user data:", userData);
          login(userData, token);
        } else {
          console.log("Session restore failed - response not ok");
        }
      } catch (error) {
        console.log("No active session found:", error);
      }
    };

    restoreSession();
  }, [login, token]);

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