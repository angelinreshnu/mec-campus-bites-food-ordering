import { db } from '@/db';
import { canteenStatus } from '@/db/schema';

async function main() {
    const sampleCanteenStatus = [
        {
            currentCrowdLevel: 'Medium',
            lastUpdated: new Date().toISOString(),
        },
    ];

    await db.insert(canteenStatus).values(sampleCanteenStatus);
    
    console.log('✅ Canteen status seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});