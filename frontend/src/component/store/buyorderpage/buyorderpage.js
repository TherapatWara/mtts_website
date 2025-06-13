import React, { useEffect, useState } from 'react';
import Navbar from '../../navbar/navbarstore'


import './buyorderpage.css'

export default function Buyorderpage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [rows, setRows] = useState([
    { iv: '', date: '', brand: '', model: '', description: '', unit: '', price: '' }
  ]);
  const [showPopup,setShowPopup] = useState(false);


  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleDateChange = (index, value) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 6) v = v.slice(0, 6);
    if (v.length >= 5) v = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4);
    else if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    handleChange(index, 'date', v);
  };

  const formatNumber = (value) => {
    if (!value) return '';
    const num = value.replace(/,/g, '');
    return Number(num).toLocaleString();
  };

  const handleAddRow = () => {
    const fristRow = rows[0] || { iv: '', date: '' };
    setRows([...rows, { iv: fristRow.iv, date: fristRow.date, brand: '', model: '', description: '', unit: '', price: '' }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleConfirm = () => {
    let inputcheck = 0;
    for(let i=0;i<rows.length;i++)
    {
      if(rows[i].iv !== '' && rows[i].date !== '' && rows[i].brand !== '' && rows[i].model !== '' && rows[i].description !== '' && rows[i].unit !== '' && rows[i].price!== '')
      {
        inputcheck = 1;
      }
      else{
        inputcheck = 0;
      }
    }
    if(inputcheck === 1)
    {
      handleAdd();
      setShowPopup(true);
      setTimeout(() => {
          setShowPopup(false);
      }, 1500)
    }
    
  }

  const handleClearRows = () => {
    setRows([
        {
            iv: '',
            date: '',
            brand: '',
            model: '',
            description: '',
            unit: '',
            price: ''
        }
    ]);
    };


    const fetchAllStoreData = async () => {
      try {
        const response = await fetch(`${apiUrl}/store`);
        if (!response.ok) {
          throw new Error('Failed to fetch store data');
        }

        const data = await response.json();
        console.log('📦 ข้อมูลใน store ทั้งหมด:', data);

        // ถ้าต้องการแสดงใน UI ก็สามารถ setState ได้ เช่น:
        // setStoreData(data);

      } catch (error) {
        console.error('❌ ดึงข้อมูลไม่สำเร็จ:', error);
      }
    };

    useEffect(() => {
      fetchAllStoreData();
    }, []);

    const handleAdd = async () => {
        try {
            // 1. ตรวจสอบว่ามีข้อมูลสินค้าในฐานข้อมูลที่มีค่าเหมือนกับข้อมูลที่จะเพิ่มหรือไม่
            const response = await fetch(`${apiUrl}/store`);
            const existingProducts = await response.json();
            
            const isProductExists = existingProducts.some((store) =>
                store.iv === rows[0].iv
            );

            if (isProductExists) {
            alert('มีข้อมูล iv: '+ rows[0].iv + ' ในระบบแล้ว⚠️');
            console.log('Buyorder already exists in the database!');
            return; // ถ้ามีข้อมูลซ้ำไม่ทำการเพิ่ม
            }

            // 2. ถ้าไม่มีข้อมูลซ้ำ จึงทำการเพิ่มสินค้าใหม่
            for (const row of rows) {
              const response = await fetch(`${apiUrl}/store`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  iv: row.iv,
                  date: row.date,
                  brand: row.brand,
                  model: row.model,
                  description: row.description,
                  unit: row.unit,
                  price: parseFloat(row.price),
                }),
              });
            }

            if (!response.ok) {
            throw new Error('Failed to add buyorder');
            }

            console.log('Product added successfully!');

            // 4. ล้างฟอร์ม
            handleClearRows();

        } catch (error) {
            alert('ผิดพลาดในการเพิ่มข้อมูล ' + rows[0].iv + ' ❌');
            console.error('Error:', error);
            console.log('Error adding product');
        }
    };


  return (
    <div className='body'>
      <Navbar />
      <div className='header-buyorder'>
        <h1>Buy Order</h1>
      </div>
      <div className='body-buyorder'>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td><input type='text' value={row.iv} onChange={(e) => handleChange(index, 'iv', e.target.value)} style={{ width: '8vw' }} /></td>
                <td><input type='text' value={row.date} onChange={(e) => handleDateChange(index, e.target.value)} placeholder='dd/mm/yy' style={{ width: '7vw' }} /></td>
                <td><input type='text' value={row.brand} onChange={(e) => handleChange(index, 'brand', e.target.value)} style={{ width: '12vw' }} /></td>
                <td><input type='text' value={row.model} onChange={(e) => handleChange(index, 'model', e.target.value)} style={{ width: '12vw' }} /></td>
                <td><input type='text' value={row.description} onChange={(e) => handleChange(index, 'description', e.target.value)} style={{ width: '18vw' }} /></td>
                <td><input type='text' value={formatNumber(row.unit)} onChange={(e) => handleChange(index, 'unit', e.target.value.replace(/\D/g, ''))} style={{ width: '5vw' }} /></td>
                <td><input type='text' value={formatNumber(row.price)} onChange={(e) => handleChange(index, 'price', e.target.value.replace(/\D/g, ''))} style={{ width: '7vw' }} /></td>
                <td>
                  <button className='delete_button-buyorder' onClick={() => handleDeleteRow(index)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className='moretable-buyorder' onClick={handleAddRow}>+</button>
      </div>
      <div className='bottom-buyorder'>
        <button className='clear-buyorder' onClick={handleClearRows}>CLEAR</button>
        <button className='confirm-buyorder' onClick={handleConfirm}>CONFIRM</button>
      </div>
      {/*Your order has been successfully sold-----------------------------------------------*/}
      {showPopup && (
        <div className='add-popup'>
            <svg xmlns="http://www.w3.org/2000/svg" height={100} fill='lime' viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
            <h3>Your order has been successfully Buy</h3>
        </div>
      )}
    </div>
  );
}
