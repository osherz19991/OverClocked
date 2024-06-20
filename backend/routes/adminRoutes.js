import express from 'express';
import multer from 'multer';
import csvtojson from 'csvtojson';
import Joi from 'joi';
import fs from 'fs';
import { getDB } from '../config/db.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer for temporary storage

const productSchema = Joi.object({
  _id: Joi.string().optional(),
  asin: Joi.string().optional(),
  title: Joi.string().required(),
  imgUrl: Joi.string().optional(),
  productURL: Joi.string().optional(),
  stars: Joi.number().optional().allow(null),
  price: Joi.number().required(),
  listPrice: Joi.number().optional().allow(null),
  category_id: Joi.string().optional(),
  Category: Joi.string().optional(),
  quantity: Joi.number().optional().default(0),
  numberOfReviews: Joi.number().optional().default(0),
});

// Route for fetching purchases based on time interval
router.get('/:timeInterval', async (req, res) => {
  try {
    const db = await getDB();
    const purchasesCollection = db.collection('purchases');

    const { timeInterval } = req.params;

    let startDate;
    switch (timeInterval) {
      case 'lastDay':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'lastWeek':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'lastMonth':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'lastYear':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
    }

    let purchases = await purchasesCollection.find({ purchaseDate: { $gte: startDate } }).toArray();
    if (!purchases) purchases = [];
    res.status(200).json(purchases);
  } catch (error) {
    console.error(`Error fetching purchases made in the last ${req.params.timeInterval}:`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching user distribution
router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const purchasesCollection = db.collection('purchases');
    const usersCollection = db.collection('accounts');

    // Count total purchases
    const totalPurchases = await purchasesCollection.countDocuments();

    // Count total users
    const totalUsers = await usersCollection.countDocuments();

    // Update user roles based on last week's created date
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);

    await usersCollection.updateMany(
      { createdDate: { $lte: lastWeekDate }, role: { $ne: 'admin' } },
      { $set: { role: 'normal' } }
    );

    await usersCollection.updateMany(
      { createdDate: { $gt: lastWeekDate }, role: { $ne: 'admin' } },
      { $set: { role: 'new' } }
    );

    // Count users by role
    const newUsersCount = await usersCollection.countDocuments({ role: 'new' });
    const normalUsersCount = await usersCollection.countDocuments({ role: 'normal' });
    const adminUsersCount = await usersCollection.countDocuments({ role: 'admin' });

    // Get product categories and count occurrences
    const purchases = await purchasesCollection.find({}).toArray();
    const categoriesCount = purchases.reduce((acc, purchase) => {
      if (Array.isArray(purchase.cartItems)) {
        purchase.cartItems.forEach(item => {
          const category = item.Category; // Access category directly from the item object
          acc[category] = (acc[category] || 0) + 1;
        });
      }
      return acc;
    }, {});

    console.log(categoriesCount);
    // Format user distribution data
    const userDistribution = {
      new: newUsersCount,
      normal: normalUsersCount,
      admin: adminUsersCount
    };

    const labels = Object.keys(categoriesCount);
    const data = Object.values(categoriesCount);

    // Generate random background colors for each category
    const categoryColors = labels.map((label, index) => {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`;
      return color;
    });

    const pieChartData = {
      labels: labels,
      datasets: [{
        label: 'Purchase Category',
        data: data,
        backgroundColor: categoryColors,
        borderWidth: 1
      }]
    };



  // Combine all data
  const summaryStats = {
    totalPurchases,
    totalUsers,
    userDistribution,
    pieChartData
  };
  res.status(200).json(summaryStats);
} catch (error) {
  console.error('Error fetching summary statistics:', error);
  res.status(500).json({ error: 'Internal Server Error' });
}
});


// Route for adding products from CSV
router.post('/products', upload.single('products'), async (req, res) => {
  try {
    const csvFilePath = req.file.path;
    const jsonArray = await csvtojson().fromFile(csvFilePath);

    const validationResult = jsonArray.map(item => productSchema.validate(item));
    const errors = validationResult.find(result => result.error);

    if (errors) {
      console.error('Validation errors:', errors.error.details);
      return res.status(400).json({ error: 'Invalid product data in CSV' });
    }

    const db = await getDB();
    const collection = db.collection('Products');

    await collection.insertMany(jsonArray);

    await fs.promises.unlink(csvFilePath);
    console.log('File deleted:', csvFilePath);

    res.status(201).json({ message: 'Products imported successfully' });
  } catch (error) {
    console.error('Error adding products from CSV:', error);

    if (error.name === 'MongoServerError' && error.code === 601) {
      res.status(500).json({ error: 'Bulk insertion timed out. Consider increasing the timeout value or splitting the data into smaller chunks.' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


export default router;
