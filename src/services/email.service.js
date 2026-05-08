const { Resend } = require('resend');

const resend = new Resend(
  process.env.RESEND_API_KEY
);

async function sendVerificationEmail(
  email,
  token
) {

  const verifyUrl =
    `http://localhost:3000/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: 'onboarding@resend.dev',

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

  await resend.emails.send({

    from: 'onboarding@resend.dev',

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

  await resend.emails.send({

    from: 'onboarding@resend.dev',

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
  sendVerificationEmail,sendResetPasswordEmail, sendOrderConfirmationEmail
};