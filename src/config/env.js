require('dotenv').config();

const requiredEnv = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'RESEND_API_KEY'
];

requiredEnv.forEach((key) => {

  if (!process.env[key]) {

    throw new Error(
      `Missing env variable: ${key}`
    );
  }
});

console.log('Environment variables loaded');