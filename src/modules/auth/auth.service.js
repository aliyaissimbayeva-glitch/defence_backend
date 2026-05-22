const prisma = require('../../lib/prisma');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const {
  generateAccessToken,
  generateRefreshToken
} = require('../../lib/jwt');
const {
  emailQueue
} = require('../../queues/email.queue');
async function register(data) {

  const {
    email,
    password,
    role,
    name,
    allergens
  } = data;

  const existing = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (existing) {
    throw new Error('Email already exists');
  }

  const passwordHash =
    await bcrypt.hash(password, 10);

  const verificationToken =
    crypto.randomBytes(32).toString('hex');

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role,
      name,

      allergens,

      verificationToken,

      isVerified: false
    }
  });


await emailQueue.add(
  'verify-email',
  {
    email: user.email,
    token: verificationToken
  },
  {
    attempts: 3
  }
);


  return user;
}
async function login(data) {

  const {
    email,
    password
  } = data;

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  if (!user.isVerified) {
    throw new Error('Email not verified');
  }

  const payload = {
    userId: user.id,
    role: user.role
  };

  const accessToken =
    generateAccessToken(payload);

  const refreshToken =
    generateRefreshToken(payload);

  await prisma.user.update({
    where: {
      id: user.id
    },

    data: {
      refreshToken
    }
  });

  return {
    accessToken,
    refreshToken
  };
}

async function refresh(data) {

  const {
    refreshToken
  } = data;

  const user = await prisma.user.findFirst({
    where: {
      refreshToken
    }
  });

  if (!user) {
    throw new Error('Invalid refresh token');
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET
  );

  const newAccessToken =
    generateAccessToken({
      userId: decoded.userId,
      role: decoded.role
    });

  return {
    accessToken: newAccessToken
  };
}

async function logout(userId) {

  await prisma.user.update({
    where: {
      id: userId
    },

    data: {
      refreshToken: null
    }
  });
}

async function forgotPassword(email) {

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const resetToken =
    crypto.randomBytes(32).toString('hex');

  await prisma.user.update({
    where: {
      id: user.id
    },

    data: {
      resetToken
    }
  });

console.log('ADDING EMAIL JOB');
  await emailQueue.add(

  'reset-password',

  {
    email: user.email,
    token: resetToken
  },

  {
    attempts: 3
  }
);
}

async function resetPassword(
  token,
  newPassword
) {

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token
    }
  });

  if (!user) {
    throw new Error('Invalid token');
  }

  const passwordHash =
    await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: user.id
    },

    data: {
      passwordHash,
      resetToken: null
    }
  });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword
};