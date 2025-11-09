import { db } from '@/db';
import { foodPosts } from '@/db/schema';

async function main() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const sampleFoodPosts = [
        {
            userId: 'student1',
            userName: 'Rajesh Kumar',
            imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
            caption: 'Best biryani ever! Worth the wait 😍',
            hashtags: '#BiryaniLove #CanteenSpecial #MealMoments #FoodieLife',
            likesCount: 45,
            createdAt: twoDaysAgo.toISOString(),
        },
        {
            userId: 'student2',
            userName: 'Priya Sharma',
            imageUrl: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800&auto=format&fit=crop',
            caption: 'Crispy dosa perfection ✨',
            hashtags: '#DosaDay #FoodieLife #SouthIndian #BreakfastGoals',
            likesCount: 38,
            createdAt: twoDaysAgo.toISOString(),
        },
        {
            userId: 'student3',
            userName: 'Arjun Patel',
            imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop',
            caption: 'Thali happiness 🍛',
            hashtags: '#SouthIndianFood #MealMoments #CanteenSpecial #Yummy',
            likesCount: 42,
            createdAt: yesterday.toISOString(),
        },
        {
            userId: 'student4',
            userName: 'Sneha Reddy',
            imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop',
            caption: 'Idli sambar combo hits different 🔥',
            hashtags: '#BreakfastGoals #SouthIndian #FoodieVibes #MealMoments',
            likesCount: 31,
            createdAt: yesterday.toISOString(),
        },
        {
            userId: 'student5',
            userName: 'Vikram Singh',
            imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
            caption: 'Late night food cravings satisfied 🌙',
            hashtags: '#CanteenDiaries #FoodieLife #NightOwl #BiryaniLove',
            likesCount: 27,
            createdAt: yesterday.toISOString(),
        },
        {
            userId: 'student6',
            userName: 'Ananya Iyer',
            imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop',
            caption: 'When the canteen food > home food 😅',
            hashtags: '#FoodieVibes #CanteenSpecial #SouthIndian #MealMoments',
            likesCount: 50,
            createdAt: now.toISOString(),
        },
        {
            userId: 'student7',
            userName: 'Rohan Nair',
            imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop',
            caption: 'Fried rice + manchurian = ❤️',
            hashtags: '#IndoChinese #Yummy #CanteenSpecial #FoodieLife',
            likesCount: 35,
            createdAt: now.toISOString(),
        },
        {
            userId: 'student8',
            userName: 'Divya Menon',
            imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop',
            caption: 'Sunday special meals 🎉',
            hashtags: '#WeekendVibes #Foodgasm #SouthIndian #MealMoments',
            likesCount: 48,
            createdAt: now.toISOString(),
        },
        {
            userId: 'student9',
            userName: 'Karthik Raj',
            imageUrl: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=800&auto=format&fit=crop',
            caption: 'Tea + samosa = perfect combo ☕',
            hashtags: '#SnackTime #CanteenDiaries #FoodieLife #EveningVibes',
            likesCount: 29,
            createdAt: now.toISOString(),
        },
        {
            userId: 'student10',
            userName: 'Meera Krishnan',
            imageUrl: 'https://images.unsplash.com/photo-1598515213692-d663d7b4e66f?w=800&auto=format&fit=crop',
            caption: 'Biryani for breakfast? Why not! 😎',
            hashtags: '#NoRegrets #FoodLover #BiryaniLove #CanteenSpecial',
            likesCount: 44,
            createdAt: now.toISOString(),
        },
    ];

    await db.insert(foodPosts).values(sampleFoodPosts);
    
    console.log('✅ Food posts seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});