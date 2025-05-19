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

  const handleChange = (e) => {
    setValue(e.target.value);
  };

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

      doc.text("ทดสอบฟอนต์ไทย", 10, 10);
      const title = searchResults[0].customer;
    
      //doc.setFontSize(12);
      //doc.text("ข้อมูลการค้นหา", 14, 32);
  
      const headers = [["Brand", "Model", "Serial", "Location", "Start Date", "End Date", "Status Warranty"]];
      const data = searchResults.map(elt => [
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
        styles: { fontSize: 10 }
      });
   
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const signatureText = "sign ................................";
      const fontSize = 12;
      doc.setFontSize(fontSize);
      const textWidth = doc.getTextWidth(signatureText);
  
      const x = pageWidth - textWidth - 100; // ช่องขวาเว้น 40pt
      const y = pageHeight - 100; // ช่องล่างเว้น 40pt
  
      doc.text(signatureText, x, y);
      doc.save("report.pdf");
    };

  return (
    <div className='body'>
      <Navbar />
      <div className='search-fill'>
        <h1>Search</h1>
        <input type="text" value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
        <button className="search-button" onClick={handleSearch}> <FaSearch /> </button>
      </div>

      {searchResults.length > 0 && (
        <>
          <button className='exportpdf' onClick={exportPDF}> Export to <span>PDF</span> </button>
          <input type='text' className='.admin-displayzone' placeholder='dd/mm/yy'></input>
        </>
      )}
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
