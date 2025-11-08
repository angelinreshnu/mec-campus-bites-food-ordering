import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

async function main() {
    const currentTimestamp = new Date().toISOString();
    const hashedPassword = bcrypt.hashSync('password123', 10);

    const sampleUsers = [
        // Admin users
        {
            email: 'admin@mec.edu',
            password: hashedPassword,
            name: 'Admin One',
            role: 'admin',
            studentId: null,
            phone: '9876543210',
            createdAt: currentTimestamp,
        },
        {
            email: 'admin2@mec.edu',
            password: hashedPassword,
            name: 'Admin Two',
            role: 'admin',
            studentId: null,
            phone: '9876543211',
            createdAt: currentTimestamp,
        },
        {
            email: 'admin3@mec.edu',
            password: hashedPassword,
            name: 'Admin Three',
            role: 'admin',
            studentId: null,
            phone: '9876543212',
            createdAt: currentTimestamp,
        },
        // Shop users
        {
            email: 'shop1@mec.edu',
            password: hashedPassword,
            name: 'Canteen 1',
            role: 'shop',
            studentId: null,
            phone: '9876543220',
            createdAt: currentTimestamp,
        },
        {
            email: 'shop2@mec.edu',
            password: hashedPassword,
            name: 'Canteen 2',
            role: 'shop',
            studentId: null,
            phone: '9876543221',
            createdAt: currentTimestamp,
        },
        {
            email: 'shop3@mec.edu',
            password: hashedPassword,
            name: 'Food Court',
            role: 'shop',
            studentId: null,
            phone: '9876543222',
            createdAt: currentTimestamp,
        },
        {
            email: 'shop4@mec.edu',
            password: hashedPassword,
            name: 'Juice Corner',
            role: 'shop',
            studentId: null,
            phone: '9876543223',
            createdAt: currentTimestamp,
        },
        {
            email: 'shop5@mec.edu',
            password: hashedPassword,
            name: 'Snacks Point',
            role: 'shop',
            studentId: null,
            phone: '9876543224',
            createdAt: currentTimestamp,
        },
        // Student users
        {
            email: 'student1@mec.edu',
            password: hashedPassword,
            name: 'Rajesh Kumar',
            role: 'student',
            studentId: 'MEC2024001',
            phone: '9876543230',
            createdAt: currentTimestamp,
        },
        {
            email: 'student2@mec.edu',
            password: hashedPassword,
            name: 'Priya Sharma',
            role: 'student',
            studentId: 'MEC2024002',
            phone: '9876543231',
            createdAt: currentTimestamp,
        },
        {
            email: 'student3@mec.edu',
            password: hashedPassword,
            name: 'Karthik Venkat',
            role: 'student',
            studentId: 'MEC2024003',
            phone: '9876543232',
            createdAt: currentTimestamp,
        },
        {
            email: 'student4@mec.edu',
            password: hashedPassword,
            name: 'Aishwarya Reddy',
            role: 'student',
            studentId: 'MEC2024004',
            phone: '9876543233',
            createdAt: currentTimestamp,
        },
        {
            email: 'student5@mec.edu',
            password: hashedPassword,
            name: 'Arjun Prasad',
            role: 'student',
            studentId: 'MEC2024005',
            phone: '9876543234',
            createdAt: currentTimestamp,
        },
        {
            email: 'student6@mec.edu',
            password: hashedPassword,
            name: 'Divya Nair',
            role: 'student',
            studentId: 'MEC2024006',
            phone: '9876543235',
            createdAt: currentTimestamp,
        },
        {
            email: 'student7@mec.edu',
            password: hashedPassword,
            name: 'Vishnu Mohan',
            role: 'student',
            studentId: 'MEC2024007',
            phone: '9876543236',
            createdAt: currentTimestamp,
        },
        {
            email: 'student8@mec.edu',
            password: hashedPassword,
            name: 'Lakshmi Iyer',
            role: 'student',
            studentId: 'MEC2024008',
            phone: '9876543237',
            createdAt: currentTimestamp,
        },
        {
            email: 'student9@mec.edu',
            password: hashedPassword,
            name: 'Suresh Babu',
            role: 'student',
            studentId: 'MEC2024009',
            phone: '9876543238',
            createdAt: currentTimestamp,
        },
        {
            email: 'student10@mec.edu',
            password: hashedPassword,
            name: 'Meera Krishnan',
            role: 'student',
            studentId: 'MEC2024010',
            phone: '9876543239',
            createdAt: currentTimestamp,
        },
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});