const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please add MONGODB_URI to your .env file.");
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB. Clearing old data...');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Generating 100 Users, 100 Products, and 100 Orders...');

    // 1. Generate 100 Users
    const usersData = Array.from({ length: 100 }).map(() => ({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      role: faker.helpers.arrayElement(['Customer', 'Customer', 'Customer', 'Admin']), // 25% admin
      createdAt: faker.date.past()
    }));
    const users = await User.insertMany(usersData);

    // 2. Generate 100 Products
    const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Toys', 'Sports', 'Beauty'];
    const productsData = Array.from({ length: 100 }).map(() => ({
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      price: parseFloat(faker.commerce.price({ min: 10, max: 2000 })),
      stock: faker.number.int({ min: 0, max: 500 }),
      tags: [faker.commerce.productAdjective(), faker.commerce.productMaterial()],
      isFeatured: faker.datatype.boolean(),
      createdAt: faker.date.past()
    }));
    const products = await Product.insertMany(productsData);

    // 3. Generate 100 Orders
    const statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
    const ordersData = Array.from({ length: 100 }).map(() => {
      // Pick 1 to 5 random products for this order
      const numProducts = faker.number.int({ min: 1, max: 5 });
      const orderProducts = [];
      let totalAmount = 0;

      for (let i = 0; i < numProducts; i++) {
        const randomProduct = faker.helpers.arrayElement(products);
        const qty = faker.number.int({ min: 1, max: 3 });
        orderProducts.push({
          productId: randomProduct._id,
          quantity: qty,
          price: randomProduct.price
        });
        totalAmount += (randomProduct.price * qty);
      }

      return {
        userId: faker.helpers.arrayElement(users)._id,
        products: orderProducts,
        status: faker.helpers.arrayElement(statuses),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        createdAt: faker.date.recent({ days: 60 })
      };
    });
    
    await Order.insertMany(ordersData);

    console.log('Successfully seeded 300 total entries into the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
