// // scripts/create-admin.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const dotenv = require('dotenv');

// dotenv.config();

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_wealth')
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ Connection error:', err));

// async function createAdmin() {
//   try {
//     const Admin = require('../models/Admin');
    
//     // Check if admin already exists
//     const existingAdmin = await Admin.findOne({ email: 'rukundoj032@gmail.com' });
    
//     if (existingAdmin) {
//       console.log('⚠️ Admin already exists! Updating password...');
      
//       // Update existing admin's password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash('Hello123@', salt);
      
//       existingAdmin.password = hashedPassword;
//       await existingAdmin.save();
      
//       console.log('✅ Admin password updated successfully!');
//     } else {
//       // Create new admin
//       const admin = new Admin({
//         email: 'rukundoj032@gmail.com',
//         password: 'Hello123@', // Will be hashed by pre-save hook
//         name: 'Super Admin',
//         role: 'super_admin'
//       });

//       await admin.save();
//       console.log('✅ Admin created successfully!');
//     }

//     console.log('\n📋 Admin Login Credentials:');
//     console.log('📧 Email: rukundoj032@gmail.com');
//     console.log('🔑 Password: Hello123@');
//     console.log('\n⚠️  Please change the password after first login!');

//   } catch (error) {
//     console.error('❌ Error creating admin:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// }

// createAdmin();













// scripts/create-admin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/apex_invest')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Connection error:', err));

async function createAdmin() {
  try {
    const Admin = require('../models/Admin');
    
    // Admin credentials
    const adminEmail = 'rukundoj032@gmail.com';
    const adminPassword = 'Hello123@';
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('⚠️ Admin already exists! Updating password...');
      
      // Update existing admin's password
      existingAdmin.password = adminPassword; // Will be hashed by pre-save hook
      existingAdmin.role = 'super_admin';
      await existingAdmin.save();
      
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create new admin
      const admin = new Admin({
        email: adminEmail,
        password: adminPassword,
        name: 'Super Admin',
        role: 'super_admin'
      });

      await admin.save();
      console.log('✅ Admin created successfully!');
    }

    console.log('\n📋 Admin Login Credentials:');
    console.log('📧 Email: rukundoj032@gmail.com');
    console.log('🔑 Password: Hello123@');
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();