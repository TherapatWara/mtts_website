import React, { useEffect, useState } from 'react'
import Navbar from '../../navbar/navbarstore'
import { useLocation, useNavigate } from 'react-router-dom';

export default function Viewpage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [rows, setRows] = useState([
      { iv: '', date: '', brand: '', model: '', description: '', unit: '', price: '' }
  ]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const iv = params.get('iv');

  useEffect(() => {
    fetch(`${apiUrl}/store`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((item) => item.iv === iv);
        setRows(filtered);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, [apiUrl, iv]);

  return (
    <div>
        <Navbar />
        <div className='header-saleorder'>
            <h1>Store</h1>

        </div>
                <div className='body-buyorder'>
                  <p>Invoice No : {rows.iv}</p>
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
            <button className='back-yourchart' onClick={()=> navigate('/billbuypage')}>BACK</button>
        </div>
    </div>
  )
}
