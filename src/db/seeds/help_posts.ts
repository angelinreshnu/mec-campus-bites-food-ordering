import { db } from '@/db';
import { helpPosts } from '@/db/schema';

async function main() {
    const sampleHelpPosts = [
        {
            userId: 'student1',
            userName: 'Rajesh Kumar',
            title: 'Lost: Black JBL Earphones',
            description: 'Lost my black JBL earphones near the library on Tuesday afternoon. Has a small scratch on the case. Please contact if found.',
            imageUrl: null,
            category: 'Lost',
            status: 'active',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'student2',
            userName: 'Priya Sharma',
            title: 'Found: Blue Water Bottle',
            description: 'Found a blue Milton water bottle near canteen entrance. Has a name sticker but can\'t read it clearly. Claim from me.',
            imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
            category: 'Found',
            status: 'resolved',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'student3',
            userName: 'Karthik Venkat',
            title: 'Found: Engineering Textbook',
            description: 'Found \'Data Structures\' textbook in classroom 301. Has name written inside. Message me to claim.',
            imageUrl: null,
            category: 'Found',
            status: 'active',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'student4',
            userName: 'Aishwarya Reddy',
            title: 'Need Lecture Notes - DBMS',
            description: 'Missed yesterday\'s DBMS lecture due to fever. Can someone share notes? Will be really grateful!',
            imageUrl: null,
            category: 'Help',
            status: 'resolved',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'student5',
            userName: 'Arjun Prasad',
            title: 'Looking for Project Partner',
            description: 'Need a partner for final year project on Machine Learning. Interested in NLP and computer vision. DM me!',
            imageUrl: null,
            category: 'Help',
            status: 'active',
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(helpPosts).values(sampleHelpPosts);
    
    console.log('✅ Help posts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});