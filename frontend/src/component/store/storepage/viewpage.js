import React, { useEffect, useState } from 'react'
import Navbar from '../../navbar/navbarstore'
import { useNavigate } from 'react-router-dom';

export default function Viewpage() {
  const navigate = useNavigate();
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
            iv: '12345',
            date: '12/06/68',
            brand: 'Germany',
            model: 'G2-60609OUT',
            description: 'Wall Rack 9U OUTDOOR (60x60x61.3cm)',
            unit: '2',
            price: '8500'
        },
        {
            iv: '12345',
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

        </div>
                <div className='body-buyorder'>
                  <p>Invoice No : 12345</p>
                  <table>
                    <thead>
                      <tr>
                        <th>Invoice no.</th>
                        <th>Date</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Description</th>
                        <th>Unit</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row,index) => (
                        <tr key={index}>
                          <td>{row.iv}</td>
                          <td>{row.date}</td>
                          <td>{row.brand}</td>
                          <td>{row.model}</td>
                          <td>{row.description}</td>
                          <td>{row.unit}</td>
                          <td>{row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
        <div className='bottom-yourchart'>
            <button className='back-yourchart' onClick={()=> navigate('/storepage')}>BACK</button>
        </div>
    </div>
  )
}
