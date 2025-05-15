import React from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่ม import useNavigate
import './navbar.css';

export default function Navbar() {
    const navigate = useNavigate(); // ใช้ hook สำหรับการนำทาง


    return (
      <div className='navbar'>
          <h1 onClick={() => navigate('/')}>Multitech Solution</h1>
          <div className='page'>
              <h2 onClick={() => navigate('/')}>Product</h2>
              <h2 onClick={() => navigate('/manage')}>Manage</h2>
          </div>
      </div>
    );
}
