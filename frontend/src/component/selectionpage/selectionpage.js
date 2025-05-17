import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './selectionpage.css'
import Navbar from '../navbar/navbarindex';

export default function Selectionpage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!isLoggedIn) {
      alert('กรุณาเข้าสู่ระบบก่อน');
      navigate('/');
    }
  }, []);
  
  return (
    
    <div className='body'>
        <Navbar />
      <div className='selection-fill'>
        
        <h1>SELECT</h1>
        <div className='selection' onClick={() => navigate('/mainpage')}>
            <h2>Product Price</h2>
        </div>
        <div className='selection' onClick={() => navigate('/maintenancepage')}>
            <h2>Maintenance</h2>
        </div>
        <div className='selection-logout' onClick={() => {localStorage.removeItem('loggedIn'); navigate('/'); navigate('/');}}>
            <h2>Logout</h2>
        </div>
      </div>


    </div>
  );
}
