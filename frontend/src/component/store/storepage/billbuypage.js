import React, { useEffect, useState } from 'react'
import Navbar from '../../navbar/navbarstore'
import './billspage.css'
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Storepage() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [rows, setRows] = useState([
    { iv: '', date: '', brand: '', model: '', description: '', unit: '', price: '' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStore, setFilteredStore] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/store`)
      .then(res => res.json())
      .then(data => {
        setRows(data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, [apiUrl]);

  const handleDelete = async (rowId) => {
        try {
            const response = await fetch(`${apiUrl}/store/${rowId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete store');
            }


            console.log('Store deleted successfully!');
            setRows(rows.filter(row => row._id !== rowId)); // Remove deleted product from state
        } catch (error) {
            console.error('Error:', error);
            console.log('Error deleting store');
        }
  };

  const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
  }

  const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredStore([]);
            return;
        }
        const searchLower = searchTerm.toLowerCase();
        const result = rows.filter(
            (row) =>
                row.iv.toLowerCase().includes(searchLower)
        );
        setFilteredStore(result);
    }

  // ลดซ้ำจาก rows และ filteredStore โดยใช้ Map (key = iv)
  const uniqueRows = Array.from(new Map(rows.map(item => [item.iv, item])).values());
  const uniqueFiltered = Array.from(new Map(filteredStore.map(item => [item.iv, item])).values());


  return (
    <div className='body'>
      <Navbar />
      <div className='header-saleorder'>
                <h1>Store</h1>
                <div className='search-zone-saleorder'>
                  <input type='text' onChange={(e) => setSearchTerm(e.target.value)} placeholder=' Search here...(Invoice no.)' onKeyDown={handleKeyDown}></input>
                  <button onClick={handleSearch}> <FaSearch /> </button>
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
                      {uniqueFiltered.map((row, index) => (
                        <tr key={index}>
                          <td>{row.iv}</td>
                          <td>{row.date}</td>
                          <td>
                            <button className='delete-button-store' onClick={() => handleDelete(row._id)}>X</button>
                            <button
                              className='add-button-saleorder'
                              onClick={() => navigate(`/billbuy/viewbuypage?iv=${row.iv}`)}
                            >
                              VIEW
                            </button>
                          </td>
                        </tr>
                      ))}

                      {uniqueRows
                        .filter(row => !uniqueFiltered.some(fp => fp.iv === row.iv))
                        .map((row, index) => (
                          <tr key={index}>
                            <td>{row.iv}</td>
                            <td>{row.date}</td>
                            <td>
                              <button className='delete-button-store' onClick={() => handleDelete(row._id)}>X</button>
                              <button
                                className='add-button-saleorder'
                                onClick={() => navigate(`/billbuypage/viewbuypage?iv=${row.iv}`)}
                              >
                                VIEW
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
      
    </div>
  )
}
