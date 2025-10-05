export const mockStats = {
    totalProducts: 128,
    totalOrders: 56,
    lowStock: 7,
    recentOrders: [
        { id: 'ORD-1001', customer: 'Alice', total: '$45.00', status: 'Pending', time: '2m ago' },
        { id: 'ORD-1002', customer: 'Bob', total: '$120.00', status: 'Shipped', time: '1h ago' },
        { id: 'ORD-1003', customer: 'Charlie', total: '$32.50', status: 'Delivered', time: '3h ago' },
    ],
    lowStockProducts: [
        { name: 'Bananas', stock: 3, image: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=facearea&w=48&h=48' },
        { name: 'Milk', stock: 2, image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=48&h=48' },
        { name: 'Eggs', stock: 1, image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=48&h=48' },
    ],
    salesTrend: [30, 45, 40, 60, 80, 70, 100], // Mock sales data for 7 days
    salesDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};