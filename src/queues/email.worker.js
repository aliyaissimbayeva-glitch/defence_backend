console.log('EMAIL WORKER STARTED');
const { Worker } = require('bullmq');

const {
  connection
} = require('./email.queue');

const {
  sendVerificationEmail,
  sendResetPasswordEmail, sendOrderConfirmationEmail
} = require('../services/email.service');

const worker = new Worker(

  'emailQueue',

  async (job) => {
console.log('WORKER GOT JOB');
console.log(job.name);
console.log(job.data);
    if (job.name === 'verify-email') {

      await sendVerificationEmail(
        job.data.email,
        job.data.token
      );
    }

    if (job.name === 'reset-password') {

      await sendResetPasswordEmail(
        job.data.email,
        job.data.token
      );
    }
    if (job.name === 'order-created') {

  await sendOrderConfirmationEmail(
    job.data.email,
    job.data.orderId
  );
}
  },

  {
    connection
  }
);

worker.on('completed', (job) => {

  console.log(
    `Job completed ${job.id}`
  );
});

worker.on('failed', (job, err) => {

  console.log(
    `Job failed ${job.id}`
  );

  console.log(err.message);
});
worker.on('failed', (job, err) => {

  console.log(
    `Job failed ${job.id}`
  );

  console.log(
    `Attempts made: ${job.attemptsMade}`
  );

  console.log(err.message);
});