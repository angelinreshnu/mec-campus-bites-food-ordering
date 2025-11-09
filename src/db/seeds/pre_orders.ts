import { db } from '@/db';
import { preOrders } from '@/db/schema';

async function main() {
    const today = new Date();
    const twelveThirtyPM = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 30, 0);
    const onePM = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0, 0);
    const oneThirtyPM = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30, 0);

    const samplePreOrders = [
        {
            userId: 'student1',
            orderItems: [
                {
                    menuItemId: 1,
                    menuItemName: 'Idli',
                    quantity: 2,
                    price: 30
                },
                {
                    menuItemId: 5,
                    menuItemName: 'Coffee',
                    quantity: 1,
                    price: 20
                }
            ],
            pickupTime: twelveThirtyPM.toISOString(),
            status: 'pending',
            createdAt: new Date().toISOString()
        },
        {
            userId: 'student2',
            orderItems: [
                {
                    menuItemId: 2,
                    menuItemName: 'Masala Dosa',
                    quantity: 1,
                    price: 50
                },
                {
                    menuItemId: 8,
                    menuItemName: 'Sambar Rice',
                    quantity: 1,
                    price: 40
                },
                {
                    menuItemId: 9,
                    menuItemName: 'Curd Rice',
                    quantity: 1,
                    price: 35
                }
            ],
            pickupTime: onePM.toISOString(),
            status: 'ready',
            createdAt: new Date().toISOString()
        },
        {
            userId: 'student3',
            orderItems: [
                {
                    menuItemId: 15,
                    menuItemName: 'Chicken Biryani',
                    quantity: 1,
                    price: 120
                }
            ],
            pickupTime: oneThirtyPM.toISOString(),
            status: 'completed',
            createdAt: new Date().toISOString()
        }
    ];

    await db.insert(preOrders).values(samplePreOrders);
    
    console.log('✅ Pre-orders seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});