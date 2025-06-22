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
    console.log(' [POST] Incoming Data(maintenance):', { customer, brand, model, serial, location, startDate, endDate, statusWarranty });

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

// recent input------------------------------------------------------------------------------------------------------
//pricelist product recent
app.get('/api/product-options', async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection('products').aggregate([
      {
        $project: {
          productLower: { $toLower: "$product" }
        }
      },
      {
        $group: {
          _id: "$productLower",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();

    res.json(result.map(item => item._id));
  } catch (err) {
    console.error('Error fetching product options:', err);
    res.status(500).send('Error fetching product options');
  }
});

//pricelist brand recent
app.get('/api/brand-options-pricelist', async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection('products').aggregate([
      {
        $project: {
          brandLower: { $toLower: "$brand" }
        }
      },
      {
        $group: {
          _id: "$brandLower",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();

    res.json(result.map(item => item._id));
  } catch (err) {
    console.error('Error fetching brand options pricelist:', err);
    res.status(500).send('Error fetching brand options pricelist');
  }
});

//maintenance customer recent
app.get('/api/customer-options', async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection('maintenances').aggregate([
      {
        $project: {
          customerLower: { $toLower: "$customer" }
        }
      },
      {
        $group: {
          _id: "$customerLower",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();

    res.json(result.map(item => item._id));
  } catch (err) {
    console.error('Error fetching customer options:', err);
    res.status(500).send('Error fetching customer options');
  }
});

//maintenance brand recent
app.get('/api/brand-options-maintenance', async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection('maintenances').aggregate([
      {
        $project: {
          brandLower: { $toLower: "$brand" }
        }
      },
      {
        $group: {
          _id: "$brandLower",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();

    res.json(result.map(item => item._id));
  } catch (err) {
    console.error('Error fetching brand options maintenance:', err);
    res.status(500).send('Error fetching brand options maintenance');
  }
});

//maintenance model recent
app.get('/api/model-options-maintenance', async (req, res) => {
  try {
    const result = await mongoose.connection.db.collection('maintenances').aggregate([
      {
        $project: {
          modelLower: { $toLower: "$model" }
        }
      },
      {
        $group: {
          _id: "$modelLower",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).toArray();

    res.json(result.map(item => item._id));
  } catch (err) {
    console.error('Error fetching model options maintenance:', err);
    res.status(500).send('Error fetching model options maintenance');
  }
});

// buyorder page------------------------------------------------------------------------------------------------------

const storeSchema = new mongoose.Schema({
  iv: String,
  date: String,
  brand: String,
  model: String,
  description: String,
  unit: String,
  price: Number,
});
const Store = mongoose.model('Store', storeSchema);

app.get('/api/store', async (req, res) => {
  try {
    const stores = await Store.find(); // ดึงข้อมูลทั้งหมด
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

app.post('/api/store', async (req, res) => {
  try {
    const {iv, date, brand, model, description, unit, price} = req.body;
    console.log(' [POST] Incoming Data(store):', { iv, date, brand, model, description, unit, price });

    const newStore = new Store({
      iv, 
      date,
      brand, 
      model, 
      description, 
      unit, 
      price
    });

    await newStore.save();
    res.status(201).json(newStore);
  } catch (err) {
    console.error('Error saving maintenance:', err);
    res.status(500).send('Error saving maintenance');
  }
});

app.delete('/api/store/:id', async (req, res) => {
  const storeId = req.params.id;
  try {
    const deletedStore = await Store.findByIdAndDelete(storeId);
    if (!deletedStore) {
      return res.status(404).send('Store record not found');
    }
    res.status(200).json({ message: 'Store record deleted successfully' });
  } catch (err) {
    console.error('Error deleting store:', err);
    res.status(500).send('Error deleting store');
  }
});

//Stock  ----------------------------------------------------------------------------------------
const stockSchema = new mongoose.Schema({
  brand: String,
  model: String,
  description: String,
  unit: Number,
});
const Stock = mongoose.model('Stock', stockSchema);

app.get('/api/stock', async (req, res) => {
  try {
    const stock = await Stock.find(); // ดึงข้อมูลทั้งหมด
    res.json(stock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

app.post('/api/stock', async(req, res) => {
  try {
    const {brand, model, description, unit} = req.body;
    console.log(' [POST] Incoming Add Data(stock):', { brand, model, description, unit });

    const newStock = new Stock({
      brand, 
      model, 
      description, 
      unit, 
    });

    await newStock.save();
    res.status(201).json(newStock);
  } catch (err) {
    console.error('Error saving stock:', err);
    res.status(500).send('Error saving stock');
  }
});

// DELETE stock
app.delete('/api/stock/:id', async (req, res) => {
  const stockId = req.params.id;
  try {
    const deletedStock = await Stock.findByIdAndDelete(stockId);
    if (!deletedStock) {
      return res.status(404).send('Stock record not found');
    }
    res.status(200).json({ message: 'Stock record deleted successfully' });
  } catch (err) {
    console.error('Error deleting stock:', err);
    res.status(500).send('Error deleting stock');
  }
});

app.put('/api/stock/:id', async (req, res) => {
  try {
    const stockId = req.params.id;
    const updateData = req.body;

    const updated = await Stock.findByIdAndUpdate(stockId, updateData, {
      new: true,
    });

    if (!updated) {
      return res.status(404).send("Stock not found");
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).send("Error updating stock");
  }
});



// ✅ ต้องอยู่ล่างสุด -------------------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

