import React, { useEffect, useState } from 'react'
import Navbar from '../../navbar/navbarstore'
import './storepage.css'
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Storepage() {
  const navigate = useNavigate();
  const [searchvalue, setSearchvalue] = useState('');
  const [rows, setRows] = useState([
    { iv: '', date: '', brand: '', model: '', description: '', unit: '', price: '' }
  ]);

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

  return (
    <div>
      <Navbar />
      <div className='header-saleorder'>
                <h1>Store</h1>
                <div className='search-zone-saleorder'>
                  <input type='text' value={searchvalue} onChange={(e) => setSearchvalue(e.target.value)} placeholder=' Search here...(Invoice no.)'></input>
                  <button> <FaSearch /> </button>
                </div>
      </div>
                <div className='body-buyorder'>
                  <table>
                    <thead>
                      <tr>
                        <th>Invoice no.</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row,index) => (
                        <tr key={index}>
                          <td>{row.iv}</td>
                          <td>{row.date}</td>
                          <td>
                            <button className='delete-button-store' >X</button>
                            <button className='add-button-saleorder' onClick={() => navigate('/storepage/viewpage')}>VIEW</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
      
    </div>
  )
}
