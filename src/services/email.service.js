const nodemailer = require('nodemailer');

const transporter =
  nodemailer.createTransport({

    service: 'gmail',

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

async function sendVerificationEmail(
  email,
  token
) {

  const verifyUrl =
    `http://localhost:3000/auth/verify-email?token=${token}`;

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject: 'Verify your account',

    html: `
      <h1>Verify Email</h1>

      <p>Click the link below:</p>

      <a href="${verifyUrl}">
        Verify Account
      </a>
    `
  });
}

async function sendResetPasswordEmail(
  email,
  token
) {

  const resetUrl =
    `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject: 'Reset Password',

    html: `
      <h1>Password Reset</h1>

      <p>
        Click below to reset password
      </p>

      <a href="${resetUrl}">
        Reset Password
      </a>
    `
  });
}

async function sendOrderConfirmationEmail(
  email,
  orderId
) {

  await transporter.sendMail({

    from: process.env.EMAIL_USER,

    to: email,

    subject: 'Order Created',

    html: `
      <h1>Order Confirmed</h1>

      <p>
        Your order #${orderId}
        was created successfully.
      </p>
    `
  });
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendOrderConfirmationEmail
};