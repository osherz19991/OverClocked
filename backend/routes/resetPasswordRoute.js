import express from 'express';
import { getDB } from '../config/db.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const db = await getDB();
    
    // Verify the token in the database
    const tokenDoc = await db.collection('passwordResetTokens').findOne({ token });
    if (!tokenDoc) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await db.collection('accounts').updateOne(
      { mail: tokenDoc.mail },
      { $set: { hashedPassword: hashedPassword } }
    );

    // Delete the token from the database after password reset
    await db.collection('passwordResetTokens').deleteOne({ token });

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
