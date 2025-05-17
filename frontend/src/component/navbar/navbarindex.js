import React from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่ม import useNavigate
import './navbar.css';

export default function Navbar() {
    const navigate = useNavigate(); // ใช้ hook สำหรับการนำทาง


    return (
      <div className='navbar'>
          <h1 onClick={() => navigate('/selectionpage')}>Multitech Solution</h1>

      </div>
    );
}
