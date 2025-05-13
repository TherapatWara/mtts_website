import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import './mainpage.css'

export default function Mainpage() {
  const [value, setValue] = useState('');
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [clickstatus, setClickstatus] = useState(0);

  useEffect(() => {
    fetch('http://api-server:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSearch = () => {
    const results = products.filter(product =>
      product.product.toLowerCase().includes(value.toLowerCase()) ||
      product.brand.toLowerCase().includes(value.toLowerCase()) ||
      product.model.toLowerCase().includes(value.toLowerCase())
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

  return (
    <div className='body'>
      <div className='search-fill'>
        <h1>Search</h1>
        <input type="text" value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
        <button className="search-button" onClick={handleSearch}> <FaSearch /> </button>
      </div>

      {searchResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((product, index) => (
              <tr key={index}>
                <td>{product.product}</td>
                <td>{product.brand}</td>
                <td>{product.model}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
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
