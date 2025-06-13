import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Mainpage from './component/mainpage/mainpage';
import ManagePage from './component/adminpage/adminpage';    
import Selectionpage from './component/selectionpage/selectionpage';
import Maintenancepage from './component/maintenancepage/maintenancepage';
import Managepagemaintenancepage from './component/adminpage_maintenance/adminpage_maintenance'
import Loginpage from './component/loginpage/loginpage';
import Buyorderpage from './component/store/buyorderpage/buyorderpage';
import Saleorderpage from './component/store/saleorderpage/saleorderpage';
import Billbuypage from './component/store/storepage/billbuypage'
import Yourchartpage from './component/store/saleorderpage/yourchartpage';
import Viewpagebuy from './component/store/storepage/viewbuypage';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Loginpage />} />
        <Route path="/selectionpage" element={<Selectionpage />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/manage" element={<ManagePage />} />
        <Route path="/maintenancepage" element={<Maintenancepage />} />
        <Route path="/manage_maintenancepage" element={<Managepagemaintenancepage />} />
        <Route path="/buyorderpage" element={<Buyorderpage />} />
        <Route path="/saleorderpage" element={<Saleorderpage />} />
        <Route path="/billbuypage" element={<Billbuypage />} />
        <Route path="/saleorderpage/yourchartpage" element={<Yourchartpage/>}/>
        <Route path='/billbuypage/viewbuypage' element={<Viewpagebuy/>}/>
      </Routes>
    </Router>
  );
} 

export default App;
