import { db } from '@/db';
import { userStats } from '@/db/schema';

async function main() {
    const currentTimestamp = new Date().toISOString();
    
    const sampleUserStats = [
        {
            userId: 'student5',
            userName: 'Arjun Prasad',
            totalOrders: 45,
            totalSpent: 7850.0,
            badges: JSON.stringify(['First Order', 'Regular Customer', 'VIP Member', 'Big Spender']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student3',
            userName: 'Karthik Venkat',
            totalOrders: 38,
            totalSpent: 6200.0,
            badges: JSON.stringify(['First Order', 'Regular Customer', 'VIP Member', 'Big Spender']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student7',
            userName: 'Vishnu Mohan',
            totalOrders: 32,
            totalSpent: 5500.0,
            badges: JSON.stringify(['First Order', 'Regular Customer', 'VIP Member', 'Big Spender']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student2',
            userName: 'Priya Sharma',
            totalOrders: 28,
            totalSpent: 4200.0,
            badges: JSON.stringify(['First Order', 'Regular Customer', 'VIP Member']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student1',
            userName: 'Rajesh Kumar',
            totalOrders: 25,
            totalSpent: 3800.0,
            badges: JSON.stringify(['First Order', 'Regular Customer', 'VIP Member']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student8',
            userName: 'Lakshmi Iyer',
            totalOrders: 20,
            totalSpent: 2600.0,
            badges: JSON.stringify(['First Order', 'Regular Customer', 'VIP Member']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student4',
            userName: 'Aishwarya Reddy',
            totalOrders: 15,
            totalSpent: 1800.0,
            badges: JSON.stringify(['First Order', 'Regular Customer', 'VIP Member']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student6',
            userName: 'Divya Nair',
            totalOrders: 12,
            totalSpent: 1200.0,
            badges: JSON.stringify(['First Order', 'Regular Customer', 'VIP Member']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student9',
            userName: 'Suresh Babu',
            totalOrders: 8,
            totalSpent: 950.0,
            badges: JSON.stringify(['First Order']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
        {
            userId: 'student10',
            userName: 'Meera Krishnan',
            totalOrders: 5,
            totalSpent: 650.0,
            badges: JSON.stringify(['First Order']),
            rank: null,
            createdAt: currentTimestamp,
            updatedAt: currentTimestamp,
        },
    ];

    await db.insert(userStats).values(sampleUserStats);
    
    console.log('✅ User stats seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});