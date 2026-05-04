import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Contests from './pages/Contests';
import ContestDetail from './pages/ContestDetail';
import ResearchPapers from './pages/ResearchPapers';
import Blogs from './pages/Blogs';
import ProblemStatement from './pages/ProblemStatement';
import Spreadsheet from './pages/Spreadsheet';

import ReactLenis from '@studio-freight/react-lenis';

function App() {
  return (
    <ReactLenis root>
      <Router>
        <div className="app-container">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contests" element={<Contests />} />
              <Route path="/contests/:slug" element={<ContestDetail />} />
              <Route path="/contests/:slug/task/:taskId/:docType" element={<ProblemStatement />} />
              <Route path="/papers" element={<ResearchPapers />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/spreadsheet" element={<Spreadsheet />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ReactLenis>
  );
}

export default App;
