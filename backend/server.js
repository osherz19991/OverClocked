import express from 'express';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
dotenv.config();
import connectDB from './config/db.js';
const port = process.env.PORT || 5000;
connectDB();
const app= express();   

app.get('/', (req, res) => {   
    res.send('API is running...');
});

app.use('/api/products', productRoutes);

app.listen(port, () => { console.log(`Server is running on port ${port}`);}); 


