const Dashboard = require('../models/dashboardModel');

exports.getDashboardData = async (req, res, next) => {
  try {
    const [
      summary, 
      recentProducts, 
      lowStockProducts, 
      recentActivity,
      categoryDistribution,
      stockStatus,
      monthlyTrend
    ] = await Promise.all([
      Dashboard.getSummaryStats(),
      Dashboard.getRecentProducts(5),
      Dashboard.getLowStockProducts(5),
      Dashboard.getRecentActivity(10),
      Dashboard.getChartCategoryDistribution(),
      Dashboard.getChartStockStatus(),
      Dashboard.getChartMonthlyTrend()
    ]);

    res.status(200).json({
      success: true,
      data: {
        summary,
        recentProducts,
        lowStockProducts,
        recentActivity,
        charts: {
          categoryDistribution,
          stockStatus,
          monthlyTrend
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
