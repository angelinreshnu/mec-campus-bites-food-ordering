import { db } from '@/db';
import { groupOrderParticipants } from '@/db/schema';

async function main() {
    const sampleParticipants = [
        {
            groupOrderId: 1,
            userId: 'student1',
            userName: 'Rajesh Kumar',
            orderItems: [
                { menuItemId: 15, menuItemName: 'Chicken Biryani', quantity: 1, price: 150 },
                { menuItemId: 45, menuItemName: 'Coke', quantity: 1, price: 20 }
            ],
            amount: 170,
        },
        {
            groupOrderId: 1,
            userId: 'student2',
            userName: 'Priya Sharma',
            orderItems: [
                { menuItemId: 16, menuItemName: 'Veg Biryani', quantity: 1, price: 120 },
                { menuItemId: 17, menuItemName: 'Lemon Rice', quantity: 1, price: 45 }
            ],
            amount: 165,
        },
        {
            groupOrderId: 1,
            userId: 'student3',
            userName: 'Karthik Venkat',
            orderItems: [
                { menuItemId: 14, menuItemName: 'Special Meals', quantity: 1, price: 120 }
            ],
            amount: 120,
        },
        {
            groupOrderId: 2,
            userId: 'student4',
            userName: 'Aishwarya Reddy',
            orderItems: [
                { menuItemId: 1, menuItemName: 'Masala Dosa', quantity: 1, price: 50 },
                { menuItemId: 2, menuItemName: 'Idli', quantity: 1, price: 30 },
                { menuItemId: 7, menuItemName: 'Coffee', quantity: 1, price: 20 }
            ],
            amount: 100,
        },
        {
            groupOrderId: 2,
            userId: 'student5',
            userName: 'Arjun Prasad',
            orderItems: [
                { menuItemId: 21, menuItemName: 'Parotta', quantity: 1, price: 40 },
                { menuItemId: 22, menuItemName: 'Kurma', quantity: 1, price: 40 },
                { menuItemId: 8, menuItemName: 'Tea', quantity: 1, price: 15 }
            ],
            amount: 95,
        },
        {
            groupOrderId: 2,
            userId: 'student6',
            userName: 'Divya Nair',
            orderItems: [
                { menuItemId: 18, menuItemName: 'Fried Rice', quantity: 1, price: 90 },
                { menuItemId: 19, menuItemName: 'Manchurian', quantity: 1, price: 50 }
            ],
            amount: 140,
        },
        {
            groupOrderId: 2,
            userId: 'student7',
            userName: 'Vishnu Mohan',
            orderItems: [
                { menuItemId: 24, menuItemName: 'Fish Curry Meals', quantity: 1, price: 140 }
            ],
            amount: 140,
        }
    ];

    await db.insert(groupOrderParticipants).values(sampleParticipants);
    
    console.log('✅ Group order participants seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});