import { db } from '@/db';
import { wallets } from '@/db/schema';

async function main() {
    const sampleWallets = [
        {
            userId: 'student1',
            balance: 450.50,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'student2',
            balance: 280.75,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'student3',
            balance: 125.00,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'student4',
            balance: 500.00,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            userId: 'student5',
            balance: 175.25,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(wallets).values(sampleWallets);
    
    console.log('✅ Wallets seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});