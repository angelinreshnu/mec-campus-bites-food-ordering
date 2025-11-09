import { db } from '@/db';
import { classSchedules } from '@/db/schema';

async function main() {
    const sampleSchedules = [
        {
            userId: 'student1',
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '10:00',
            className: 'Data Structures',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'student2',
            dayOfWeek: 'Tuesday',
            startTime: '10:00',
            endTime: '11:00',
            className: 'Web Development',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'student3',
            dayOfWeek: 'Wednesday',
            startTime: '14:00',
            endTime: '15:00',
            className: 'Database Systems',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'student4',
            dayOfWeek: 'Thursday',
            startTime: '15:00',
            endTime: '16:00',
            className: 'Machine Learning',
            createdAt: new Date().toISOString(),
        },
        {
            userId: 'student5',
            dayOfWeek: 'Friday',
            startTime: '11:00',
            endTime: '12:00',
            className: 'Computer Networks',
            createdAt: new Date().toISOString(),
        },
    ];

    await db.insert(classSchedules).values(sampleSchedules);
    
    console.log('✅ Class schedules seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});