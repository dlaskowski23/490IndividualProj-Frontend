import React from 'react';
import LandingPage from './pages/landingPage';
import FilmPage from './pages/filmPage';
import CustomerPage from './pages/customerPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/filmPage" element={<FilmPage />} />
          <Route path="/customerPage" element={<CustomerPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
