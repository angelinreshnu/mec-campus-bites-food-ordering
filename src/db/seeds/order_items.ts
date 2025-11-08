import { db } from '@/db';
import { orderItems } from '@/db/schema';

async function main() {
    const now = Date.now();
    const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000).toISOString();
    const thirtyMinutesAgo = new Date(now - 30 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString();
    const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000).toISOString();
    const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString();
    const fiveHoursAgo = new Date(now - 5 * 60 * 60 * 1000).toISOString();

    const sampleOrderItems = [
        {
            orderId: 1,
            menuItemId: 22,
            quantity: 1,
            price: 150.0,
            createdAt: twoDaysAgo,
        },
        {
            orderId: 2,
            menuItemId: 19,
            quantity: 1,
            price: 90.0,
            createdAt: oneDayAgo,
        },
        {
            orderId: 3,
            menuItemId: 24,
            quantity: 1,
            price: 180.0,
            createdAt: twoHoursAgo,
        },
        {
            orderId: 3,
            menuItemId: 27,
            quantity: 1,
            price: 20.0,
            createdAt: twoHoursAgo,
        },
        {
            orderId: 4,
            menuItemId: 21,
            quantity: 1,
            price: 120.0,
            createdAt: thirtyMinutesAgo,
        },
        {
            orderId: 5,
            menuItemId: 38,
            quantity: 1,
            price: 85.0,
            createdAt: oneHourAgo,
        },
        {
            orderId: 6,
            menuItemId: 35,
            quantity: 1,
            price: 75.0,
            createdAt: fifteenMinutesAgo,
        },
        {
            orderId: 7,
            menuItemId: 24,
            quantity: 1,
            price: 180.0,
            createdAt: threeDaysAgo,
        },
        {
            orderId: 8,
            menuItemId: 39,
            quantity: 1,
            price: 140.0,
            createdAt: fiveHoursAgo,
        },
    ];

    await db.insert(orderItems).values(sampleOrderItems);
    
    console.log('✅ Order items seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});