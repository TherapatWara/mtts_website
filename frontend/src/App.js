import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/navbar/navbar';
import Mainpage from './component/mainpage/mainpage';
import ManagePage from './component/adminpage/adminpage';    

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/manage" element={<ManagePage />} />
      </Routes>
    </Router>
  );
}

export default App;
