// signinRoutes.js

import express from 'express';
import bcrypt from 'bcrypt';
import { getDB } from '../config/db.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
const router = express.Router();

const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Route handler for user sign-in
router.post('/', async (req, res) => {
  try {
    // Extract user data from request body
    const { identifier, password } = req.body;
    const db = await getDB();
    const accountsCollectionName = 'accounts';
    
    // Find the user by email or username
    const account = await db.collection(accountsCollectionName).findOne({ $or: [{ mail: identifier }, { username: identifier }] });
    
    if (!account) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Compare the hashed password stored in the database with the provided password
    const passwordMatch = await bcrypt.compare(password, account.hashedPassword);
    
    if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // If the passwords match, return success
    res.json({ username: account.username });

  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/sendPasswordReset', async (req, res) => {
  try {
    // Extract user data from request body
    const { mail} = req.body;
    const db = await getDB();
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

    const resetToken = generateResetToken();

    // Save the token in the database for later verification
    await db.collection('passwordResetTokens').insertOne({ mail, token: resetToken });

    const resetLink = `http://http://localhost:3000/password-reset?token=${resetToken}`;
    const mailOptions = {
      from: 'overclocked.users@gmail.com',
      to: mail,
      subject: 'Reset Password',
      text: 'Your password reset link is here please press here in order to reset your password\n' + resetLink,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.json({ message: 'Password reset link sent' });

  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
