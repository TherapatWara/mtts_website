import React, { useEffect, useState } from 'react';
import Navbar from '../../navbar/navbarstore';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Viewsalepage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [projectname, setProjectname] = useState('');
  const [date, setDate] = useState('');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const projectQuery = params.get('projectname'); // เปลี่ยนจาก iv เป็น projectname

  useEffect(() => {
    fetch(`${apiUrl}/billsale`)
      .then((res) => res.json())
      .then((data) => {
        // หาใบเสร็จที่มีชื่อโปรเจคตรงกัน
        const found = data.find((bill) => bill.projectname === projectQuery);
        if (found) {
          setRows(found.items || []);
          setProjectname(found.projectname);
          setDate(new Date(found.date).toLocaleDateString());
        }
      })
      .catch((err) => console.error('Error fetching billsale:', err));
  }, [apiUrl, projectQuery]);

  return (
    <div>
      <Navbar />
      <div className='header-saleorder'>
        <h1>Bill Details</h1>
      </div>
      <div className='body-buyorder'>
        <p><strong>Project Name:</strong> {projectname}</p>

        <table>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Date</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Description</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{projectname}</td>
                <td>{date}</td>
                <td>{row.brand}</td>
                <td>{row.model}</td>
                <td>{row.description}</td>
                <td>{row.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='bottom-yourchart'>
        <button className='back-yourchart' onClick={() => navigate('/billsalepage')}>BACK</button>
      </div>
    </div>
  );
}
