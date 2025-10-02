const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/analytics/spending - Get category-wise spending data
router.get('/spending', async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;
    
    // Default to current month if no dates provided
    const now = new Date();
    const defaultStartDate = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEndDate = endDate ? new Date(endDate) : new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get category-wise spending
    const categorySpending = await prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        date: {
          gte: defaultStartDate,
          lte: defaultEndDate
        }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    // Get category details
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        icon: true,
        color: true
      }
    });

    // Combine data
    const spendingData = categorySpending.map(item => {
      const category = categories.find(cat => cat.id === item.categoryId);
      return {
        categoryId: item.categoryId,
        categoryName: category?.name || 'Unknown',
        categoryIcon: category?.icon || '❓',
        categoryColor: category?.color || '#666666',
        totalAmount: parseFloat(item._sum.amount || 0),
        transactionCount: item._count.id
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount);

    // Calculate total spending
    const totalSpending = spendingData.reduce((sum, item) => sum + item.totalAmount, 0);

    // Calculate percentages
    const spendingWithPercentages = spendingData.map(item => ({
      ...item,
      percentage: totalSpending > 0 ? (item.totalAmount / totalSpending * 100).toFixed(1) : 0
    }));

    res.json({
      spendingData: spendingWithPercentages,
      totalSpending,
      dateRange: {
        startDate: defaultStartDate,
        endDate: defaultEndDate
      },
      summary: {
        totalCategories: spendingData.length,
        totalTransactions: spendingData.reduce((sum, item) => sum + item.transactionCount, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching spending analytics:', error);
    res.status(500).json({ error: 'Failed to fetch spending analytics' });
  }
});

// GET /api/analytics/summary - Get spending summary for dashboard
router.get('/summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Current month spending
    const currentMonthSpending = await prisma.expense.aggregate({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    // Last month spending
    const lastMonthSpending = await prisma.expense.aggregate({
      where: {
        date: {
          gte: startOfLastMonth,
          lte: endOfLastMonth
        }
      },
      _sum: {
        amount: true
      }
    });

    // Recent transactions (last 5)
    const recentTransactions = await prisma.expense.findMany({
      take: 5,
      orderBy: {
        date: 'desc'
      },
      include: {
        category: true
      }
    });

    const currentSpending = parseFloat(currentMonthSpending._sum.amount || 0);
    const lastSpending = parseFloat(lastMonthSpending._sum.amount || 0);
    const spendingChange = lastSpending > 0 ? ((currentSpending - lastSpending) / lastSpending * 100).toFixed(1) : 0;

    res.json({
      currentMonthSpending,
      lastMonthSpending,
      spendingChange: parseFloat(spendingChange),
      recentTransactions,
      summary: {
        totalTransactions: currentMonthSpending._count.id,
        averageTransaction: currentMonthSpending._count.id > 0 
          ? (currentSpending / currentMonthSpending._count.id).toFixed(2) 
          : 0
      }
    });
  } catch (error) {
    console.error('Error fetching summary analytics:', error);
    res.status(500).json({ error: 'Failed to fetch summary analytics' });
  }
});

module.exports = router;
