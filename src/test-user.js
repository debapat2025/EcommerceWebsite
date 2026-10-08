// //this file is for testing the user model and password hashing. It is not part of the application and should not be used in production.

// const env = require('./config/env');
// const connectDB = require('./config/db');
// const User = require('./models/user.model');

// (async () => {
//   await connectDB();

//   const user = await User.create({
//     name: 'Test User',
//     email: 'TEST@example.com',
//     password: 'Password@123',
//   });
//   console.log('created:', user.toJSON());

//   const found = await User.findOne({ email: 'test@example.com' }).select('+password');
//   console.log('stored hash:', found.password);
//   console.log('correct password:', await found.comparePassword('Password@123'));
//   console.log('wrong password:', await found.comparePassword('wrong'));

//   await User.deleteOne({ _id: user._id });
//   process.exit(0);
// })();