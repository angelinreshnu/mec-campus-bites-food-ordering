import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').notNull(), // 'student', 'admin', 'shop'
  studentId: text('student_id'),
  phone: text('phone'),
  createdAt: text('created_at').notNull(),
});

// Menu Items table
export const menuItems = sqliteTable('menu_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(), // 'breakfast', 'lunch', 'dinner'
  price: real('price').notNull(),
  imageUrl: text('image_url'),
  available: integer('available', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Orders table
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull(), // 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
  paymentMethod: text('payment_method').notNull(), // 'gpay', 'online', 'cash'
  paymentStatus: text('payment_status').notNull(), // 'pending', 'completed', 'failed'
  orderDate: text('order_date').notNull(),
  deliveryTime: text('delivery_time'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Order Items table
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  menuItemId: integer('menu_item_id').references(() => menuItems.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  createdAt: text('created_at').notNull(),
});

// Cart Items table
export const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  menuItemId: integer('menu_item_id').references(() => menuItems.id).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Class Schedules table
export const classSchedules = sqliteTable('class_schedules', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  dayOfWeek: text('day_of_week').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  className: text('class_name').notNull(),
  createdAt: text('created_at').notNull(),
});

// Pre-Orders table
export const preOrders = sqliteTable('pre_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  orderItems: text('order_items', { mode: 'json' }).notNull(),
  pickupTime: text('pickup_time').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull(),
});

// Canteen Status table
export const canteenStatus = sqliteTable('canteen_status', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  currentCrowdLevel: text('current_crowd_level').notNull(),
  lastUpdated: text('last_updated').notNull(),
});

// Group Orders table
export const groupOrders = sqliteTable('group_orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  joinCode: text('join_code').notNull().unique(),
  creatorId: text('creator_id').notNull(),
  groupName: text('group_name').notNull(),
  status: text('status').notNull().default('active'),
  totalAmount: real('total_amount').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

// Group Order Participants table
export const groupOrderParticipants = sqliteTable('group_order_participants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  groupOrderId: integer('group_order_id').references(() => groupOrders.id).notNull(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  orderItems: text('order_items', { mode: 'json' }).notNull(),
  amount: real('amount').notNull(),
});

// Wallets table
export const wallets = sqliteTable('wallets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique(),
  balance: real('balance').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Wallet Transactions table
export const walletTransactions = sqliteTable('wallet_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  walletId: integer('wallet_id').references(() => wallets.id).notNull(),
  userId: text('user_id').notNull(),
  amount: real('amount').notNull(),
  transactionType: text('transaction_type').notNull(),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull(),
});

// Food Posts table
export const foodPosts = sqliteTable('food_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption').notNull(),
  hashtags: text('hashtags'),
  likesCount: integer('likes_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

// Post Likes table
export const postLikes = sqliteTable('post_likes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => foodPosts.id).notNull(),
  userId: text('user_id').notNull(),
  createdAt: text('created_at').notNull(),
});

// Post Comments table
export const postComments = sqliteTable('post_comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  postId: integer('post_id').references(() => foodPosts.id).notNull(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  comment: text('comment').notNull(),
  createdAt: text('created_at').notNull(),
});

// User Stats table
export const userStats = sqliteTable('user_stats', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique(),
  userName: text('user_name').notNull(),
  totalOrders: integer('total_orders').notNull().default(0),
  totalSpent: real('total_spent').notNull().default(0),
  badges: text('badges', { mode: 'json' }),
  rank: integer('rank'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Help Posts table
export const helpPosts = sqliteTable('help_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  imageUrl: text('image_url'),
  category: text('category').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: text('created_at').notNull(),
});

// Meal Preferences table
export const mealPreferences = sqliteTable('meal_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: text('user_id').notNull().unique(),
  budgetRange: text('budget_range').notNull(),
  dietPreference: text('diet_preference').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});