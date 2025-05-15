import React, { useState, useEffect } from 'react';
import './adminpage.css'


export default function Adminpage() {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');
    const [value4, setValue4] = useState('');
    const [value5, setValue5] = useState('');
    const [products, setProducts] = useState([]);
    const [editProductId, setEditProductId] = useState(null);


    useEffect(() => {
        fetch(`${apiUrl}/products`)
          .then(res => res.json())
          .then(data => {
            setProducts(data);
          })
          .catch(err => console.error('Error fetching products:', err));
      }, [apiUrl]);

    const formatPrice = (value) => {
    if (!value) return '';
    const num = value.replace(/,/g, '');
    return Number(num).toLocaleString();
    };

    const handlePriceChange = (e) => {
        const raw = e.target.value.replace(/,/g, '');
        if (!/^\d*$/.test(raw)) return; // ตรวจให้เป็นตัวเลขเท่านั้น
        setValue5(raw);
    };


    const handleAdd = async () => {
        try {
            // 1. ตรวจสอบว่ามีข้อมูลสินค้าในฐานข้อมูลที่มีค่าเหมือนกับข้อมูลที่จะเพิ่มหรือไม่
            const response = await fetch(`${apiUrl}/products`);
            const existingProducts = await response.json();
            
            const isProductExists = existingProducts.some((product) =>
                product.model === value3
            );

            if (isProductExists) {
            console.log('Product already exists in the database!');
            return; // ถ้ามีข้อมูลซ้ำไม่ทำการเพิ่ม
            }

            // 2. ถ้าไม่มีข้อมูลซ้ำ จึงทำการเพิ่มสินค้าใหม่
            const addResponse = await fetch(`${apiUrl}/products`, {
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

            console.log('Product added successfully!');

            // 3. รีเฟรชข้อมูลจากฐานข้อมูลใหม่
            const updatedProducts = await fetch(`${apiUrl}/products`)
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
            console.log('Error adding product');
        }
    };

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(`${apiUrl}/products/${productId}`, {
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

    const handleEdit = (product) => {
        console.log('Editing product:', product);
        setValue1(product.product || '');
        setValue2(product.brand || '');
        setValue3(product.model || '');
        setValue4(product.description || '');
        setValue5(product.price !== undefined && product.price !== null ? product.price.toString() : '');
        setEditProductId(product._id);
    };


    const handleUpdate = async () => {
        try {
            const response = await fetch(`${apiUrl}/products/${editProductId}`, {
                method: 'PUT',
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

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            console.log('Product updated successfully!');
            
            // โหลดข้อมูลใหม่
            const updatedProducts = await fetch(`${apiUrl}/products`)
                .then((res) => res.json());

            setProducts(updatedProducts);

            // เคลียร์ฟอร์ม
            setValue1('');
            setValue2('');
            setValue3('');
            setValue4('');
            setValue5('');
            setEditProductId(null);
        } catch (error) {
            console.error('Error updating product:', error);

        }
    };




  return (
    
    <div className='body'>
        <div className='admin-search-fill'>
            <h1>Add Product</h1>
            <div className='input-container'>
                <div className='input-group'>
                    <h2>Product</h2>
                    <input type="text" style={{width:'20vh'}} value={value1} onChange={(e) => setValue1(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Brand</h2>
                    <input type="text" style={{width:'15vh'}} value={value2} onChange={(e) => setValue2(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Model</h2>
                    <input type="text" style={{width:'25vh'}} value={value3} onChange={(e) => setValue3(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Description</h2>
                    <input type="text" style={{width:'80vh'}} value={value4} onChange={(e) => setValue4(e.target.value)} />
                </div>
                <div className='input-group'>
                    <h2>Price</h2>
                    <input type="text" style={{width:'15vh'}} value={formatPrice(value5)} onChange={handlePriceChange} />

                </div>
                <div className='input-group'>
                    {editProductId ? (<button onClick={handleUpdate}>UPDATE</button>) : (<button onClick={handleAdd}>ADD</button>)}
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
                                <td>{Number(product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td>
                                    <button className='delete_button' onClick={() => handleDelete(product._id)}>Delete</button>
                                    <button className='edit_button' onClick={() => handleEdit(product)}>Edit</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>




    </div>
  )
}
