// signupRoutes.js

import express from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { getDB } from '../config/db.js';

const router = express.Router();

// Function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password strength
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

// Route handler for user signup
router.post('/', async (req, res) => {
  try {
    // Extract user data from request body
    const { name, password, email } = req.body;
    const mail = email;
    const username = name;

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit' });
    }

    const db = await getDB();
    const accountsCollectionName = 'accounts';
    const existingUsername = await db.collection(accountsCollectionName).findOne({ username });
  
    const existingEmail = await db.collection(accountsCollectionName).findOne({ mail });

    if (existingUsername ) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (existingEmail ) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: 'overclocked.users@gmail.com', 
        pass: 'bumn hozy elrp uirz', 
      },
    });

    const mailOptions = {
      from: 'overclocked.users@gmail.com',
      to: mail,
      subject: 'Registration Complete',
      text: 'Thank you for registrating to OverClocked. We hope you will have a nice shopping experience with us.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    await db.collection(accountsCollectionName). insertOne({
       username,
       hashedPassword, 
       mail, 
       role: 'new',
        createdDate: new Date() });

    res.json({ message: 'Account created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
