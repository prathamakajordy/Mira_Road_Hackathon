import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import QuickAssessment from './pages/QuickAssessment';
import AssessmentResult from './pages/AssessmentResult';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <main className="relative w-screen min-h-screen overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/assess/general" element={<QuickAssessment />} />
        <Route path="/assess/result" element={<AssessmentResult />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </main>
  );
}
