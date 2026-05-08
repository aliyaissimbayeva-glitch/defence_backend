require('./config/env');
require('./queues/email.worker');
const app = require('./app');

const prisma =
  require('./lib/prisma');

const {
  updateDecayStates
} = require('./jobs/decay.worker');

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