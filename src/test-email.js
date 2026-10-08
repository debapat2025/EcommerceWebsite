// const env = require('./config/env');
// const sendEmail = require('./utils/sendEmail');
// const templates = require('./utils/emailTemplates');

// (async () => {
//   await sendEmail({
//     to: 'test@example.com',
//     ...templates.verifyEmail({
//       name: 'Rahul <b>Sharma</b>', // deliberately contains HTML to test escaping
//       url: `${env.API_URL}/api/v1/auth/verify-email/sampletoken123`,
//     }),
//   });

//   await sendEmail({
//     to: 'test@example.com',
//     ...templates.resetPassword({
//       name: 'Rahul',
//       url: `${env.API_URL}/api/v1/auth/reset-password/sampletoken456`,
//     }),
//   });

//   process.exit(0);
// })().catch((err) => {
//   console.error('FAILED:', err.message);
//   process.exit(1);
// });