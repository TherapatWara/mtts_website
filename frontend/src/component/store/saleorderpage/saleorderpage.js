import React, { useState, useEffect } from 'react'
import Navbar from '../../navbar/navbarstore'
import { FaSearch } from 'react-icons/fa';
import './saleorderpage.css'
import { useNavigate } from 'react-router-dom';

export default function Saleorderpage() {
  const navigate = useNavigate();
  const [searchvalue, setSearchvalue] = useState('');
  const [rows, setRows] = useState([
      { iv: '', date: '', brand: '', model: '', description: '', unit: '', price: '' }
  ]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    setRows([
    {
        iv: '12345',
        date: '12/06/68',
        brand: 'Hikvision',
        model: '	DS-3E1518P-SI',
        description: 'POE Switch 16 Port',
        unit: '1',
        price: '7800'
    },
    {
        iv: '678910',
        date: '12/06/68',
        brand: 'Germany',
        model: 'G2-60609OUT',
        description: 'Wall Rack 9U OUTDOOR (60x60x61.3cm)',
        unit: '2',
        price: '8500'
    },
    {
        iv: '5555555',
        date: '12/06/68',
        brand: '	Germany',
        model: 'G7-05002',
        description: 'FAN Heavy Duty 2 x 4"',
        unit: '13',
        price: '1345'
    }
    ]);
  }, []);
  
  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAdd = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 1500); // ซ่อนหลัง 1500ms
  };

  return (
   <div>
        <Navbar />
        <div className='header-saleorder'>
          <h1>Sale Order</h1>
          <div className='search-zone-saleorder'>
            <input type='text' value={searchvalue} onChange={(e) => setSearchvalue(e.target.value)} placeholder=' Search here...(Brand)(Model)'></input>
            <button> <FaSearch /> </button>
          </div>
          <button className='.cart-container' onClick={() => navigate('yourchartpage')}>
              <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 0 576 512" fill='white'>
                <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
              </svg>
          </button>
        </div>

        <div className='body-buyorder'>
          <table>
            <thead>
              <tr>
                <th>Brand</th>
                <th>Model</th>
                <th>Description</th>
                <th>Unit/Stock</th>
                <th>Unit/Sale</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row,index) => (
                <tr key={index}>
                  <td>{row.brand}</td>
                  <td>{row.model}</td>
                  <td>{row.description}</td>
                  <td>{row.unit}</td>
                  <td><input className='unitsale-input' type='number' min={0} defaultValue={0}></input></td>
                  <td><button className='add-button-saleorder' onClick={handleAdd}>ADD</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
{/*add Popup--------------------------------------------------------------------------------------------*/}
        {showPopup && (
          <div className='add-popup'>
            <svg xmlns="http://www.w3.org/2000/svg" height={100} fill='lime' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
            <h3>Product has been added to the chart</h3>
          </div>
        )}
        
      </div>
  )
}
