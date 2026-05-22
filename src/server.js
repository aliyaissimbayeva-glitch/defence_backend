require('./config/env');
try {

  require('./queues/email.worker');

  console.log('WORKER IMPORTED');

} catch (err) {

  console.log('WORKER IMPORT ERROR');

  console.log(err);
}
const app = require('./app');

const prisma =
  require('./lib/prisma');

const {
  updateDecayStates
} = require('./modules/jobs/decay.worker');

const PORT =
  process.env.PORT || 3000;

setInterval(
  updateDecayStates,
  900000
);

const server = app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});

async function gracefulShutdown() {

  console.log('Shutting down...');

  await prisma.$disconnect();

  server.close(() => {

    console.log('Server closed');

    process.exit(0);
  });
}

process.on(
  'SIGINT',
  gracefulShutdown
);

process.on(
  'SIGTERM',
  gracefulShutdown
);