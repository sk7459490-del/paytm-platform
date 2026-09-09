const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Register as merchant
const merchantSchema = Joi.object({
  businessName: Joi.string().required(),
  category: Joi.string().required(),
  description: Joi.string(),
});

router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { error, value } = merchantSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { businessName, category, description } = value;
    const merchantId = uuidv4();

    await pool.query(
      'INSERT INTO merchants (id, user_id, business_name, category, description, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
      [merchantId, req.userId, businessName, category, description || '', 'pending']
    );

    res.status(201).json({
      message: 'Merchant registration submitted',
      merchantId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get merchant profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, business_name, category, status, created_at FROM merchants WHERE user_id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Merchant profile not found' });
    }

    res.json({ merchant: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process payment from customer
const paymentSchema = Joi.object({
  merchantId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  description: Joi.string(),
});

router.post('/payment', authMiddleware, async (req, res) => {
  try {
    const { error, value } = paymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { merchantId, amount, description } = value;

    // Get customer wallet
    const customerWallet = await pool.query(
      'SELECT id, balance FROM wallets WHERE user_id = $1',
      [req.userId]
    );

    if (customerWallet.rows.length === 0) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (parseFloat(customerWallet.rows[0].balance) < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Get merchant wallet
    const merchantResult = await pool.query(
      'SELECT user_id FROM merchants WHERE id = $1',
      [merchantId]
    );

    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Merchant not found' });
    }

    const merchantUserId = merchantResult.rows[0].user_id;
    const merchantWallet = await pool.query(
      'SELECT id FROM wallets WHERE user_id = $1',
      [merchantUserId]
    );

    // Deduct from customer
    await pool.query(
      'UPDATE wallets SET balance = balance - $1 WHERE id = $2',
      [amount, customerWallet.rows[0].id]
    );

    // Add to merchant
    await pool.query(
      'UPDATE wallets SET balance = balance + $1 WHERE id = $2',
      [amount, merchantWallet.rows[0].id]
    );

    // Create transaction record
    const transactionId = uuidv4();
    await pool.query(
      'INSERT INTO transactions (id, user_id, merchant_id, type, amount, status, description, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())',
      [transactionId, req.userId, merchantId, 'merchant_payment', amount, 'completed', description || '']
    );

    res.json({
      message: 'Payment processed successfully',
      transaction: {
        id: transactionId,
        amount,
        merchantId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get merchant transactions
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const merchantResult = await pool.query(
      'SELECT id FROM merchants WHERE user_id = $1',
      [req.userId]
    );

    if (merchantResult.rows.length === 0) {
      return res.status(404).json({ message: 'Merchant profile not found' });
    }

    const merchantId = merchantResult.rows[0].id;

    const result = await pool.query(
      `SELECT id, amount, status, description, created_at 
       FROM transactions 
       WHERE merchant_id = $1 
       ORDER BY created_at DESC 
       LIMIT 100`,
      [merchantId]
    );

    res.json({ transactions: result.rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
