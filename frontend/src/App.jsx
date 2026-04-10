import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import QuickAssessment from './pages/QuickAssessment';
import AssessmentResult from './pages/AssessmentResult';
import DiseaseAssessment from './pages/DiseaseAssessment';
import DiseaseResult from './pages/DiseaseResult';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import DiseaseDashboard from './pages/DiseaseDashboard';
import ReportUpload from './pages/ReportUpload';
import ReportResult from './pages/ReportResult';

export default function App() {
  return (
    <main className="relative w-screen min-h-screen overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assess/general" element={<QuickAssessment />} />
        <Route path="/assess/:disease" element={<DiseaseAssessment />} />
        <Route path="/result/:disease" element={<DiseaseResult />} />
        <Route path="/assess/result" element={<AssessmentResult />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:disease" element={<DiseaseDashboard />} />
        <Route path="/report" element={<ReportUpload />} />
        <Route path="/report/result" element={<ReportResult />} />
      </Routes>
    </main>
  );
}
