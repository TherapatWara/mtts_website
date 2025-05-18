import React, { useState, useEffect } from 'react';
import './adminpage_maintenance.css'
import Navbar from '../navbar/navbarmaintenancepage';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export default function Adminpage() {
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
        if (!isLoggedIn) {
          alert('กรุณาเข้าสู่ระบบก่อน');
          navigate('/');
        }
      }, []);

    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');
    const [value4, setValue4] = useState('');
    const [value6, setValue6] = useState('');
    const [value7, setValue7] = useState('');
    const [value8, setValue8] = useState('');
    const [value9, setValue9] = useState('IN');
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);


    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredProducts([]);
            return;
        }
        const searchLower = searchTerm.toLowerCase();
        const result = products.filter(
            (product) =>
                product.customer.toLowerCase().includes(searchLower) ||
                product.serial.toLowerCase().includes(searchLower)
        );
        setFilteredProducts(result);
    }

    const handleSearchUpdate = (data = products) => {
        if (!searchTerm.trim()) {
            setFilteredProducts([]);
            return;
        }
        const searchLower = searchTerm.toLowerCase();
        const result = data.filter(
            (product) =>
                product.customer.toLowerCase().includes(searchLower) ||
                product.serial.toLowerCase().includes(searchLower)
        );
        setFilteredProducts(result);
    }


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    useEffect(() => {
        fetch(`${apiUrl}/maintenance`)
          .then(res => res.json())
          .then(data => {
            setProducts(data);
          })
          .catch(err => console.error('Error fetching products:', err));
      }, [apiUrl]);

    


    const handleAdd = async () => {
        try {
            // 1. ตรวจสอบว่ามีข้อมูลสินค้าในฐานข้อมูลที่มีค่าเหมือนกับข้อมูลที่จะเพิ่มหรือไม่
            const response = await fetch(`${apiUrl}/maintenance`);
            const existingProducts = await response.json();
            
            const isProductExists = existingProducts.some((product) =>
                product.serial === value4
            );

            if (isProductExists) {
                alert('มีข้อมูล '+ value4 + ' ในระบบแล้ว⚠️');
                console.log('Product already exists in the database!');
                return; // ถ้ามีข้อมูลซ้ำไม่ทำการเพิ่ม
            }

            // 2. ถ้าไม่มีข้อมูลซ้ำ จึงทำการเพิ่มสินค้าใหม่
            const addResponse = await fetch(`${apiUrl}/maintenance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //customer, brand, , serial, product, location, startDate, endDate, statusWarranty
            body: JSON.stringify({
                customer: value1,
                brand: value2,
                model: value3,
                serial: value4,
                location: value6,
                startDate: value7,
                endDate: value8,
                statusWarranty: value9,
            }),
            });

            if (!addResponse.ok) {
            throw new Error('Failed to add product');
            }
            alert('คุณได้เพิ่ม ' + value4 + ' เรียบร้อย ✅');
            console.log('Product added successfully!');

            // 3. รีเฟรชข้อมูลจากฐานข้อมูลใหม่
            const updatedProducts = await fetch(`${apiUrl}/maintenance`)
            .then((res) => res.json())
            .catch((err) => console.error('Error fetching products:', err));

            setProducts(updatedProducts); // อัปเดต state ของ products

            // 4. ล้างฟอร์ม
            setValue1('');
            setValue2('');
            setValue3('');
            setValue4('');
            setValue6('');
            setValue7('');
            setValue8('');
            setValue9('IN');

        } catch (error) {
            alert('ผิดพลาดในการเพิ่มข้อมูล ' + value4 + ' ❌');
            console.error('Error:', error);
            console.log('Error adding product');
        }
    };

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`${apiUrl}/maintenance/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete product');
            }


            console.log('Product deleted successfully!');
            setProducts(products.filter(product => product._id !== productId)); // Remove deleted product from state
        } catch (error) {
            console.error('Error:', error);
            console.log('Error deleting product');
        }
    };
/*
    const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toISOString().split('T')[0];
    };*/

    const handleEdit = (product) => {
        console.log('Editing product:', product);
        setValue1(product.customer || '');
        setValue2(product.brand || '');
        setValue3(product.model || '');
        setValue4(product.serial || '');
        setValue6(product.location || '');
        setValue7(product.startDate || '');
        setValue8(product.endDate || '');
        setValue9(product.statusWarranty || '');
        setEditProductId(product._id);
    };


    const handleUpdate = async () => {
        try {
            const response = await fetch(`${apiUrl}/maintenance/${editProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    customer: value1,
                    brand: value2,
                    model: value3,
                    serial: value4,
                    location: value6,
                    startDate: value7,
                    endDate: value8,
                    statusWarranty: value9,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }
            alert("แก้ไข " + value4 + " เรียบร้อย✅");
            console.log('Product updated successfully!');
            
            // โหลดข้อมูลใหม่
            const updatedProducts = await fetch(`${apiUrl}/maintenance`)
                .then((res) => res.json());

            setProducts(updatedProducts);
            
            setFilteredProducts([]);
            if(searchTerm.trim() !== '')
            { 
                handleSearchUpdate(updatedProducts);
            }
            // เคลียร์ฟอร์ม
            setValue1('');
            setValue2('');
            setValue3('');
            setValue4('');
            setValue6('');
            setValue7('');
            setValue8('');
            setValue9('IN');
            setEditProductId(null);
        } catch (error) {
            alert("ผิดพลาดในการแก้ไข❌");
            console.error('Error updating product:', error);

        }
    };




  return (
    
    <div className='body'>
        <Navbar />
        <div className='admin-search-fill'>
            <h1>Add Maintenance Product</h1>
            <div className='input-container'>
                <div className='input-group'>
                    <h2>Customer</h2>
                    <input type="text" style={{width:'20vh'}} name='customer' autoComplete="on" value={value1} onChange={(e) => setValue1(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Brand</h2>
                    <input type="text" style={{width:'20vh'}} name='brand' autoComplete="on" value={value2} onChange={(e) => setValue2(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Model</h2>
                    <input type="text" style={{width:'30vh'}} name='model' autoComplete="on" value={value3} onChange={(e) => setValue3(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Serial</h2>
                    <input type="text" style={{width:'30vh'}} value={value4} onChange={(e) => setValue4(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Location</h2>
                    <input type="text" style={{width:'30vh'}} name='location' autoComplete="on" value={value6} onChange={(e) => setValue6(e.target.value)} />
                </div>

                <div className='input-group'>
                    <h2>Start  Date</h2>
                    <input type="text" style={{width:'25vh'}} value={value7} onChange={(e) => setValue7(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>End  Date</h2>
                    <input type="text" style={{width:'25vh'}} value={value8} onChange={(e) => setValue8(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Status Warranty</h2>
                    <select name="Warranty" style={{width:'25vh', height:'4.6vh'}} id="Warranty" value={value9} onChange={(e) => setValue9(e.target.value)}>
                        <option value="in">IN</option>
                        <option value="out">OUT</option>
                    </select>
                </div>
                <div className='input-group'>
                    {editProductId ? (<button onClick={handleUpdate}>UPDATE</button>) : (<button onClick={handleAdd}>ADD</button>)}
                </div>
            </div>
            
        </div>
        <div className='admin-displayzone'>
            <div className='admin-container'>
                <input name='customer' autoComplete='on' placeholder=' search...(customer)(serial)' onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown}></input>
                <button className="search-button" onClick={handleSearch} > <FaSearch /> </button>
                <h1>All Product Maintenance List</h1>
            </div>

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
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {/* แสดงผลลัพธ์การค้นหา (ถ้ามี) ไว้ด้านบน */}
                {filteredProducts.map((product) => (
                    <tr key={product._id}>
                    <td>{product.customer}</td>
                    <td>{product.brand}</td>
                    <td>{product.model}</td>
                    <td>{product.serial}</td>
                    <td>{product.location}</td>
                    <td>{product.startDate}</td>
                    <td>{product.endDate}</td>
                    <td style={{ textTransform: 'uppercase' }}>{product.statusWarranty}</td>
                    <td>
                        <button className='delete_button' onClick={() => handleDelete(product._id)}>Delete</button>
                        <button className='edit_button' onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        handleEdit(product);
                        }}>
                        Edit
                        </button>
                    </td>
                    </tr>
                ))}

                {/* แล้วค่อยแสดง product ปกติ (ยกเว้นที่ค้นเจอแล้ว) */}
                {products
                    .filter(
                    (product) =>
                        !filteredProducts.some((fp) => fp._id === product._id)
                    )
                    .map((product) => (
                    <tr key={product._id}>
                        <td>{product.customer}</td>
                        <td>{product.brand}</td>
                        <td>{product.model}</td>
                        <td>{product.serial}</td>
                        <td>{product.location}</td>
                        <td>{product.startDate}</td>
                        <td>{product.endDate}</td>
                        <td style={{ textTransform: 'uppercase' }}>{product.statusWarranty}</td>
                        <td>
                        <button className='delete_button' onClick={() => handleDelete(product._id)}>Delete</button>
                        <button className='edit_button' onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            handleEdit(product);
                        }}>
                            Edit
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
