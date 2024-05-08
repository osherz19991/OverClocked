// signinRoutes.js

import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; // Import the User model
import { connectDB } from '../config/db.js';

const router = express.Router();

// Route handler for user sign-in
router.post('/', async (req, res) => {
  try {
    // Extract user data from request body
    const { identifier, password } = req.body;
    const db = await connectDB();
    const accountsCollectionName = 'accounts';

    
    const account = await db.collection(accountsCollectionName).findOne({  $or: [{ email: identifier,password }, { username: identifier,password }]});
    
    if (!account) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }    
    res.json({username: account.username});

  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
