import { db } from '@/db';
import { orders } from '@/db/schema';

async function main() {
    const now = Date.now();
    
    const sampleOrders = [
        {
            userId: 9,
            totalPrice: 150.0,
            status: 'delivered',
            paymentMethod: 'gpay',
            paymentStatus: 'completed',
            orderDate: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
            deliveryTime: new Date(now - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 10,
            totalPrice: 90.0,
            status: 'delivered',
            paymentMethod: 'online',
            paymentStatus: 'completed',
            orderDate: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
            deliveryTime: new Date(now - 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
            createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - 1 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
        },
        {
            userId: 11,
            totalPrice: 200.0,
            status: 'preparing',
            paymentMethod: 'cash',
            paymentStatus: 'pending',
            orderDate: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
            deliveryTime: null,
            createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 12,
            totalPrice: 120.0,
            status: 'ready',
            paymentMethod: 'gpay',
            paymentStatus: 'completed',
            orderDate: new Date(now - 30 * 60 * 1000).toISOString(),
            deliveryTime: null,
            createdAt: new Date(now - 30 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - 10 * 60 * 1000).toISOString(),
        },
        {
            userId: 13,
            totalPrice: 85.0,
            status: 'confirmed',
            paymentMethod: 'online',
            paymentStatus: 'completed',
            orderDate: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
            deliveryTime: null,
            createdAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 14,
            totalPrice: 75.0,
            status: 'pending',
            paymentMethod: 'cash',
            paymentStatus: 'pending',
            orderDate: new Date(now - 15 * 60 * 1000).toISOString(),
            deliveryTime: null,
            createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - 15 * 60 * 1000).toISOString(),
        },
        {
            userId: 15,
            totalPrice: 180.0,
            status: 'cancelled',
            paymentMethod: 'online',
            paymentStatus: 'failed',
            orderDate: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
            deliveryTime: null,
            createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            userId: 16,
            totalPrice: 140.0,
            status: 'delivered',
            paymentMethod: 'gpay',
            paymentStatus: 'completed',
            orderDate: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
            deliveryTime: new Date(now - 5 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            createdAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(now - 5 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(orders).values(sampleOrders);
    
    console.log('✅ Orders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});