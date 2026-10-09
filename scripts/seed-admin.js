require('../src/config/env'); // loads .env and checks the required keys

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/user.model');
const authValidator = require('../src/validators/auth.validator');

// Optional flag: npm run seed:admin -- --promote
const promote = process.argv.includes('--promote');

const run = async () => {
  // 1. Validate the settings with the SAME rules as registration
  const { error, value } = authValidator.register.body.validate(
    {
      name: process.env.ADMIN_NAME || 'Super Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
    { abortEarly: false }
  );

  if (error) {
    console.error('Invalid admin settings in .env:');
    error.details.forEach((d) => console.error(` - ${d.message.replace(/"/g, '')}`));
    return 1;
  }

  await connectDB();

  // 2. Does this email already exist?
  const existing = await User.findOne({ email: value.email });

  if (existing) {
    if (existing.role === 'admin') {
      console.log(`Admin already exists: ${existing.email}. Nothing changed.`);
      return 0;
    }

    if (!promote) {
      console.error(`${existing.email} already exists as a normal user. Nothing changed.`);
      console.error('To make this user an admin, run: npm run seed:admin -- --promote');
      return 1;
    }

    await User.updateOne({ _id: existing._id }, { role: 'admin', isVerified: true });
    console.log(`${existing.email} is now an admin.`);
    if (!existing.isActive) {
      console.warn('Warning: this account is deactivated and cannot log in.');
    }
    return 0;
  }

  // 3. Create the admin (the pre-save hook hashes the password)
  await User.create({
    name: value.name,
    email: value.email,
    password: value.password,
    role: 'admin',
    isVerified: true,
  });

  console.log(`Admin created: ${value.email}`);
  return 0;
};

(async () => {
  let code = 1;
  try {
    code = await run();
  } catch (err) {
    console.error('Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(code);
  }
})();