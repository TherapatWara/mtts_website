const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // << ต้องมาก่อน route POST

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/mongoproducts_db', {
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

    const newProduct = new Product({
      product,
      brand,
      model,
      description,
      price
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).send('Error saving product');
  }
});

// เพิ่ม API สำหรับลบข้อมูลสินค้า
app.delete('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).send('Product not found');
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Error deleting product');
  }
});


// GET route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).send('Error fetching products');
  }
});



// ✅ ต้องอยู่ล่างสุด
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


