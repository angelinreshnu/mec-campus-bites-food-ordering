import { db } from '@/db';
import { groupOrders, groupOrderParticipants } from '@/db/schema';

async function main() {
    const sampleGroupOrders = [
        {
            joinCode: 'ABC123',
            creatorId: 'student1',
            groupName: 'Lunch Squad',
            status: 'active',
            totalAmount: 450.00,
            createdAt: new Date('2024-01-15T12:00:00').toISOString(),
        },
        {
            joinCode: 'XYZ789',
            creatorId: 'student2',
            groupName: 'Dinner Gang',
            status: 'completed',
            totalAmount: 600.00,
            createdAt: new Date('2024-01-14T18:30:00').toISOString(),
        },
    ];

    await db.insert(groupOrders).values(sampleGroupOrders);

    const sampleParticipants = [
        {
            groupOrderId: 1,
            userId: 'student1',
            userName: 'John Doe',
            orderItems: [
                { menuItemId: 1, name: 'Chicken Biryani', quantity: 1, price: 120.00 },
                { menuItemId: 2, name: 'Masala Dosa', quantity: 1, price: 80.00 }
            ],
            amount: 200.00,
        },
        {
            groupOrderId: 1,
            userId: 'student3',
            userName: 'Mike Johnson',
            orderItems: [
                { menuItemId: 3, name: 'Paneer Butter Masala', quantity: 1, price: 150.00 }
            ],
            amount: 150.00,
        },
        {
            groupOrderId: 1,
            userId: 'student4',
            userName: 'Sarah Smith',
            orderItems: [
                { menuItemId: 4, name: 'Veg Fried Rice', quantity: 1, price: 100.00 }
            ],
            amount: 100.00,
        },
        {
            groupOrderId: 2,
            userId: 'student2',
            userName: 'Jane Smith',
            orderItems: [
                { menuItemId: 5, name: 'Chicken Tikka', quantity: 1, price: 180.00 }
            ],
            amount: 180.00,
        },
        {
            groupOrderId: 2,
            userId: 'student5',
            userName: 'David Wilson',
            orderItems: [
                { menuItemId: 6, name: 'Dal Makhani', quantity: 1, price: 120.00 },
                { menuItemId: 7, name: 'Naan', quantity: 2, price: 40.00 }
            ],
            amount: 160.00,
        },
        {
            groupOrderId: 2,
            userId: 'student6',
            userName: 'Emily Brown',
            orderItems: [
                { menuItemId: 8, name: 'Veg Manchurian', quantity: 1, price: 130.00 }
            ],
            amount: 130.00,
        },
        {
            groupOrderId: 2,
            userId: 'student7',
            userName: 'Chris Lee',
            orderItems: [
                { menuItemId: 9, name: 'Chicken Curry', quantity: 1, price: 130.00 }
            ],
            amount: 130.00,
        },
    ];

    await db.insert(groupOrderParticipants).values(sampleParticipants);
    
    console.log('✅ Group orders and participants seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});