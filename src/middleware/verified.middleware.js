const prisma = require('../lib/prisma');

async function requireVerified(
  req,
  res,
  next
) {

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId
    }
  });

  if (!user.isVerified) {

    return res.status(403).json({
      error: 'Email not verified'
    });
  }

  next();
}

module.exports = {
  requireVerified
};