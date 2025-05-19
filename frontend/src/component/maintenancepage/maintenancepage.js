import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './maintencncepage.css'
import Navbar from '../navbar/navbarmaintenancepage';

import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Maintenancepage() {
    const navigate = useNavigate();

    useEffect(() => {
            const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
            if (!isLoggedIn) {
            alert('กรุณาเข้าสู่ระบบก่อน');
            navigate('/');
            }
        }, []);
        
  const apiUrl = process.env.REACT_APP_API_URL;

  const [value, setValue] = useState('');
  const [dmy, setDmy] = useState('');
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [clickstatus, setClickstatus] = useState(0);

  useEffect(() => {
    fetch(`${apiUrl}/maintenance`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, [apiUrl]);


  const handleSearch = () => {
    const results = products.filter(product =>
      product.customer.toLowerCase().includes(value.toLowerCase()) ||
      product.serial.toLowerCase().includes(value.toLowerCase())
    );

    setSearchResults(results);
    setClickstatus(0);

    if (value && results.length === 0) {
      setClickstatus(1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  const exportPDF = () => {
      const unit = "pt";
      const size = "A4";
      const orientation = "portrait";
      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);
      doc.setFontSize(12);

      const pageWidth = doc.internal.pageSize.getWidth();
      //const pageHeight = doc.internal.pageSize.getHeight();

      const date = `Date: ${dmy}`;
      const textWidth = doc.getTextWidth(date);
      doc.text(date, pageWidth - textWidth - 40, 40);

      const title = searchResults[0].customer;
      const headers = [["No", "Brand", "Model", "Serial", "Location", "Start Date", "End Date", "Status Warranty"]];
      console.log("searchResults:", searchResults);

      const data = (searchResults || []).map((elt, index) => [
        index+1,
        elt.brand,
        elt.model,
        elt.serial,
        elt.location,
        elt.startDate,
        elt.endDate,
        elt.statusWarranty,
      ]);
  
      doc.text(title, marginLeft, 40);
      doc.autoTable({
        startY: 50,
        head: headers,
        body: data,
        styles: { fontSize: 8 },
        headStyles: { halign: 'center' },
        bodyStyles: { halign: 'center' }
      });

      const tableBottomY = doc.lastAutoTable.finalY || 60;
   
      const checkerText = "Checker (MT): ______________________________";
      const supervisorText = "Supervisor (DITS): ______________________________" ;
      const dateLabel = "Date : __________";

      // ตำแหน่ง x ซ้าย เว้นขอบซ้าย 100pt
      const xLeft = 80;

      // ตำแหน่ง x ขวา เว้นขอบขวา 100pt (วัดจากขอบขวาลบความกว้างข้อความ)
      const dateTextWidth = doc.getTextWidth(dateLabel);
      const xRight = pageWidth - dateTextWidth - 80;

      // ตำแหน่ง y
      const yChecker = tableBottomY + 50;       // Checker
      const ySupervisor = yChecker + 20;       // Supervisor

      // วาดข้อความด้านซ้าย
      doc.text(checkerText, xLeft, yChecker);
      doc.text(supervisorText, xLeft, ySupervisor);

      // วาดข้อความวันที่ด้านขวา
      doc.text(dateLabel, xRight, yChecker);
      doc.text(dateLabel, xRight, ySupervisor);

      doc.save("report.pdf");
    };

  return (
    <div className='body'>
      <Navbar />
      <div className='search-fill'>
        {searchResults.length > 0 && (
        <>
          <div className='exportpdf'>
            Date:<input type='text' value={dmy} onChange={(e) => setDmy(e.target.value)} placeholder='dd/mm/yy'></input>
            <button  onClick={exportPDF}> Export to <span>PDF</span> </button>
          
          </div>
        </>
        )}
        <h1>Search</h1>
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} />
        <button className="search-button" onClick={handleSearch}> <FaSearch /> </button>
      </div>
      
      {searchResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Serial</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status Warranty</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((product, index) => (
              <tr key={index}>
                <td>{product.customer}</td>
                <td>{product.brand}</td>
                <td>{product.model}</td>
                <td>{product.serial}</td>
                <td>{product.location}</td>
                <td>{product.startDate}</td>
                <td>{product.endDate}</td>
                <td style={{ textTransform: 'uppercase' }}>{product.statusWarranty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {clickstatus !== 0 && value && searchResults.length === 0 && (
        <p>No products found</p>
      )}
    </div>
  );
}
