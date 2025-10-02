const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users - Get current user (single user system)
router.get('/', async (req, res) => {
  try {
    // For single user system, get the first user or create default
    let user = await prisma.user.findFirst();
    
    if (!user) {
      // Create default user if none exists
      user = await prisma.user.create({
        data: {
          name: 'Suman K K',
          email: 'suman@example.com'
        }
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PUT /api/users - Update current user
router.put('/', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    
    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Get current user
    let user = await prisma.user.findFirst();
    
    if (!user) {
      // Create new user if none exists
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email?.trim() || null,
          avatar: avatar?.trim() || null
        }
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: name.trim(),
          email: email?.trim() || null,
          avatar: avatar?.trim() || null
        }
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// POST /api/users/reset - Reset user to default
router.post('/reset', async (req, res) => {
  try {
    // Get current user
    let user = await prisma.user.findFirst();
    
    if (!user) {
      // Create default user if none exists
      user = await prisma.user.create({
        data: {
          name: 'Suman K K',
          email: 'suman@example.com'
        }
      });
    } else {
      // Reset to default values
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: 'Suman K K',
          email: 'suman@example.com',
          avatar: null
        }
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error resetting user:', error);
    res.status(500).json({ error: 'Failed to reset user' });
  }
});

module.exports = router;
