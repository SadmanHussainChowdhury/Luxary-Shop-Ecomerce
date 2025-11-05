import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import { Product } from '@/models/Product'
import { Order } from '@/models/Order'
import { User } from '@/models/User'
import { requireAdmin } from '@/lib/auth-server'

export async function GET(req: NextRequest) {
  try {
    // Require admin authentication
    await requireAdmin()
    
    await connectToDatabase()

    // Fetch all stats in parallel
    const [products, orders, users, recentOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(10).lean(),
    ])

    // Calculate revenue from paid/fulfilled orders
    const revenueOrders = await Order.find({
      status: { $in: ['paid', 'fulfilled'] }
    }).lean()
    
    const revenue = revenueOrders.reduce((sum, o) => sum + (o.total || 0), 0)

    // Calculate stats breakdown
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    const awaiting = orderStats.find((s: any) => s._id === 'awaiting_payment')?.count || 0
    const paid = orderStats.find((s: any) => s._id === 'paid')?.count || 0
    const fulfilled = orderStats.find((s: any) => s._id === 'fulfilled')?.count || 0
    const cancelled = orderStats.find((s: any) => s._id === 'cancelled')?.count || 0

    // Recent activity
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title createdAt')
      .lean()

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean()

    // Calculate trends (comparing with previous period)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

    const [
      productsThisMonth,
      productsLastMonth,
      ordersThisMonth,
      ordersLastMonth,
      usersThisMonth,
      usersLastMonth,
      revenueThisMonth,
      revenueLastMonth,
    ] = await Promise.all([
      Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Product.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Order.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
      Order.find({ createdAt: { $gte: thirtyDaysAgo }, status: { $in: ['paid', 'fulfilled'] } }).lean(),
      Order.find({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: { $in: ['paid', 'fulfilled'] } }).lean(),
    ])

    // Calculate revenue for periods
    const revenueThisMonthTotal = revenueThisMonth.reduce((sum, o) => sum + (o.total || 0), 0)
    const revenueLastMonthTotal = revenueLastMonth.reduce((sum, o) => sum + (o.total || 0), 0)

    // Calculate percentage changes
    const productChange = productsLastMonth > 0 
      ? Math.round(((productsThisMonth - productsLastMonth) / productsLastMonth) * 100)
      : productsThisMonth > 0 ? 100 : 0
    
    const orderChange = ordersLastMonth > 0
      ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100)
      : ordersThisMonth > 0 ? 100 : 0
    
    const userChange = usersLastMonth > 0
      ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100)
      : usersThisMonth > 0 ? 100 : 0
    
    const revenueChange = revenueLastMonthTotal > 0
      ? Math.round(((revenueThisMonthTotal - revenueLastMonthTotal) / revenueLastMonthTotal) * 100)
      : revenueThisMonthTotal > 0 ? 100 : 0

    return NextResponse.json({
      stats: {
        products,
        orders,
        users,
        revenue: revenue.toFixed(2),
        awaiting,
        paid,
        fulfilled,
        cancelled,
      },
      trends: {
        products: productChange,
        orders: orderChange,
        users: userChange,
        revenue: revenueChange,
      },
      recent: {
        orders: recentOrders.slice(0, 5),
        products: recentProducts,
        users: recentUsers,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

