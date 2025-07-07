// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage'; // you'll create this
// import LoginPage from './pages/LoginPage'; // for later

const App: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<InventoryPage />} />
      {/* <Route path="/login" element={<LoginPage />} /> */}
    </Routes>
  </Router>
);

export default App;
