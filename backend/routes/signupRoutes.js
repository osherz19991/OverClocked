// signupRoutes.js

import express from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js'; // Import the User model
import { connectDB } from '../config/db.js';

const router = express.Router();

// Route handler for user signup
router.post('/', async (req, res) => {
  try {
    // Extract user data from request body
    const { name, password, email } = req.body;
    const mail = email;
    const username = name;
    console.log(req.body)
    const db = await connectDB();
    const accountsCollectionName = 'accounts';
    const existingAccount = await db.collection(accountsCollectionName).findOne({ username });
  
    if(existingAccount){
      return res.status(400).json({ error: 'Username already exists' }); 
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true, 
      auth: {
        user: 'overclocked.users@gmail.com', // Your Gmail email address
        pass: 'bumn hozy elrp uirz', // Your Gmail password
      },
    });

    const mailOptions = {
      from: 'overclocked.users@gmail.com',
      to: mail,
      subject: 'Registration Complete',
      text: 'Thank you for your registration for OverClocked we hope you will have nice shopping experience with us',
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    await db.collection(accountsCollectionName).insertOne({ username, password, mail });
  
    res.json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
