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

// maintenance page------------------------------------------------------------------------------------------------------
const maintenanceSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  brand: String,
  model: String,
  serial: String,
  location: String,
  startDate: String,
  endDate: String,
  statusWarranty: { type: String, enum: ['in', 'out', 'IN', 'OUT'], required: true },
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
// GET all maintenance
app.get('/api/maintenance', async (req, res) => {
  try {
    const maintenances = await Maintenance.find();
    console.log(` [GET] ${maintenances.length} maintenance records fetched`);
    res.json(maintenances);
  } catch (err) {
    console.error('Error fetching maintenance:', err);
    res.status(500).send('Error fetching maintenance');
  }
});

// POST new maintenance record
app.post('/api/maintenance', async (req, res) => {
  try {
    const {customer, brand, model, serial, location, startDate, endDate, statusWarranty, } = req.body;
    console.log(' [POST] Incoming Data(maintenance):', { customer, brand, model, serial, product, location, startDate, endDate, statusWarranty });

    const newMaintenance = new Maintenance({
      customer,
      brand,
      model,
      serial,
      location,
      startDate,
      endDate,
      statusWarranty,
    });

    await newMaintenance.save();
    res.status(201).json(newMaintenance);
  } catch (err) {
    console.error('Error saving maintenance:', err);
    res.status(500).send('Error saving maintenance');
  }
});


// DELETE maintenance record
app.delete('/api/maintenance/:id', async (req, res) => {
  const maintenanceId = req.params.id;
  try {
    const deletedMaintenance = await Maintenance.findByIdAndDelete(maintenanceId);
    if (!deletedMaintenance) {
      return res.status(404).send('Maintenance record not found');
    }
    res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (err) {
    console.error('Error deleting maintenance:', err);
    res.status(500).send('Error deleting maintenance');
  }
});

// PUT update maintenance record
app.put('/api/maintenance/:id', async (req, res) => {
  const maintenanceId = req.params.id;
  const { customer, brand, model, serial, location, startDate, endDate, statusWarranty } = req.body;

  try {
    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      maintenanceId,
      { customer, brand, model, serial, location, startDate, endDate, statusWarranty },
      { new: true }
    );

    if (!updatedMaintenance) {
      return res.status(404).send('Maintenance record not found');
    }
    res.status(200).json(updatedMaintenance);
  } catch (err) {
    console.error('Error updating maintenance:', err);
    res.status(500).send('Error updating maintenance');
  }
});




// ✅ ต้องอยู่ล่างสุด
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
