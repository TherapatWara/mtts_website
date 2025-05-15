require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongo:27017/products_db';

// Middleware
app.use(cors());
app.use(express.json()); // << ต้องมาก่อน route POST

// MongoDB connection
mongoose.connect(mongoURI, {
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Schema + Model
const productSchema = new mongoose.Schema({
  product: String,
  brand: String,
  model: String,
  description: String,
  price: Number
});

const Product = mongoose.model('Product', productSchema);

// ✅ POST route ต้องอยู่ก่อน listen
app.post('/api/products', async (req, res) => {
  try {
    const { product, brand, model, description, price } = req.body;
    console.log(' [POST] Incoming Data:', { product, brand, model, description, price });

    const newProduct = new Product({
      product,
      brand,
      model,
      description,
      price
    });
    await newProduct.save();
    console.log('success add product',product,brand,model,description,price);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).send('Error saving product');
  }
});

// เพิ่ม API สำหรับลบข้อมูลสินค้า
app.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  console.log(' [DELETE] Product ID:', productId);
  
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      console.warn(' Product not found for deletion:', productId);
      return res.status(404).send('Product not found');
    }
    console.log('Product deleted:', deletedProduct);
    res.status(200).json({ message: 'Product deleted successfully' });

  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Error deleting product');
  }
});

// PUT route: แก้ไขข้อมูลสินค้า
app.put('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  const { product, brand, model, description, price } = req.body;

  console.log(' [PUT] Product ID:', productId);
  console.log(' Updated Data:', { product, brand, model, description, price });

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { product, brand, model, description, price },
      { new: true } // ส่งค่ากลับเป็นของใหม่หลังอัปเดต
    );

    if (!updatedProduct) {
    console.warn(' Product not found for update:', productId);
      return res.status(404).send('Product not found');
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Error updating product');
  }
});


// GET route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    console.log(` [GET] ${products.length} products fetched`);
    res.json(products);
  } catch (err) {
    console.error(' Error fetching products:', err);
    res.status(500).send('Error fetching products');
  }
});



// ✅ ต้องอยู่ล่างสุด
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
