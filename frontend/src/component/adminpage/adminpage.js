import React, { useState, useEffect } from 'react';
import './adminpage.css'


export default function Adminpage() {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');
    const [value4, setValue4] = useState('');
    const [value5, setValue5] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
          .then(res => res.json())
          .then(data => {
            setProducts(data);
          })
          .catch(err => console.error('Error fetching products:', err));
      }, []);

    const handleAdd = async () => {
        try {
            // 1. ตรวจสอบว่ามีข้อมูลสินค้าในฐานข้อมูลที่มีค่าเหมือนกับข้อมูลที่จะเพิ่มหรือไม่
            const response = await fetch('http://localhost:5000/api/products');
            const existingProducts = await response.json();
            
            const isProductExists = existingProducts.some((product) =>
            product.product === value1 && product.brand === value2 && product.model === value3
            );

            if (isProductExists) {
            alert('Product already exists in the database!');
            return; // ถ้ามีข้อมูลซ้ำไม่ทำการเพิ่ม
            }

            // 2. ถ้าไม่มีข้อมูลซ้ำ จึงทำการเพิ่มสินค้าใหม่
            const addResponse = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                product: value1,
                brand: value2,
                model: value3,
                description: value4,
                price: parseFloat(value5),
            }),
            });

            if (!addResponse.ok) {
            throw new Error('Failed to add product');
            }

            alert('Product added successfully!');

            // 3. รีเฟรชข้อมูลจากฐานข้อมูลใหม่
            const updatedProducts = await fetch('http://localhost:5000/api/products')
            .then((res) => res.json())
            .catch((err) => console.error('Error fetching products:', err));

            setProducts(updatedProducts); // อัปเดต state ของ products

            // 4. ล้างฟอร์ม
            setValue1('');
            setValue2('');
            setValue3('');
            setValue4('');
            setValue5('');

        } catch (error) {
            console.error('Error:', error);
            alert('Error adding product');
        }
    };

const handleDelete = async (productId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        const result = await response.json();
        alert('Product deleted successfully!');
        setProducts(products.filter(product => product._id !== productId)); // Remove deleted product from state
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting product');
    }
};




  return (
    
    <div className='body'>
        <div className='admin-search-fill'>
            <h1>Add Product</h1>
            <div className='input-container'>
                <div className='input-group'>
                    <h2>Product</h2>
                    <input type="text" value={value1} onChange={(e) => setValue1(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Brand</h2>
                    <input type="text" value={value2} onChange={(e) => setValue2(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Model</h2>
                    <input type="text" value={value3} onChange={(e) => setValue3(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Description</h2>
                    <input type="text" value={value4} onChange={(e) => setValue4(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Price</h2>
                    <input type="text" value={value5} onChange={(e) => setValue5(e.target.value)} />
                </div>
                <div className='input-group'>
                    <button onClick={handleAdd}>Add</button>
                </div>
            </div>
            
        </div>
        <div className='admin-displayzone'>
            <h1>All Product List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Model</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        return (
                            <tr key={product._id}>
                                <td>{product.product}</td>
                                <td>{product.brand}</td>
                                <td>{product.model}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td><button onClick={() => handleDelete(product._id)}>Delete</button></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>




    </div>
  )
}
