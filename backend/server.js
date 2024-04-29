
import express from 'express';

import  { MongoClient }  from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const mongoUrl = process.env.MONGO_URI;
const dbName = 'final_project';
const productsCollectionName = 'Products';

const connectDB = async () => {
  try {
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

// GET route to fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection(productsCollectionName).find({}).limit(5).toArray();
    console.log('Fetched products:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});