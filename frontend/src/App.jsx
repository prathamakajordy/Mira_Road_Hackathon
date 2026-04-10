import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoBackground from './components/VideoBackground';
import HeroSection from './components/HeroSection';
import QuickAssessment from './pages/QuickAssessment';
import AssessmentResult from './pages/AssessmentResult';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <main className="relative w-screen min-h-screen overflow-x-hidden">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <VideoBackground />
                <HeroSection />
              </>
            } 
          />
          <Route path="/assess/general" element={<QuickAssessment />} />
          <Route path="/assess/result" element={<AssessmentResult />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
