const prisma = require('../../lib/prisma');

const { register } = require('./auth.service');
const { login } = require('./auth.service');
const { refresh } = require('./auth.service');
const { logout } = require('./auth.service');

const {
  forgotPassword,
  resetPassword
} = require('./auth.service');

const {
  registerSchema,
  loginSchema
} = require('./auth.schema');

async function registerController(req, res) {
  try {
    const parsed = registerSchema.parse(req.body);
    const user = await register(parsed);

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'USER_REGISTERED',
        entityType: 'User',
        entityId: String(user.id)
      }
    });

    const { passwordHash, ...safeUser } = user;
    res.status(201).json(safeUser);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function loginController(req, res) {
  try {
    const parsed = loginSchema.parse(req.body);
    const result = await login(parsed);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email }
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'USER_LOGIN',
        entityType: 'User',
        entityId: String(user.id)
      }
    });

    res.json(result);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function refreshController(req, res) {
  try {
    const result = await refresh(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function logoutController(req, res) {
  try {
    await logout(req.user.userId);

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'USER_LOGOUT',
        entityType: 'User',
        entityId: String(req.user.userId)
      }
    });

    res.json({ message: 'Logged out' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'EMAIL_VERIFIED',
        entityType: 'User',
        entityId: String(user.id)
      }
    });

    res.json({ message: 'Email verified' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    await forgotPassword(req.body.email);

    const user = await prisma.user.findUnique({
      where: { email: req.body.email }
    });

    if (user) {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'PASSWORD_RESET_REQUESTED',
          entityType: 'User',
          entityId: String(user.id)
        }
      });
    }

    res.json({ message: 'Password reset email sent' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token }
    });

    await resetPassword(token, newPassword);

    if (user) {
      await prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'PASSWORD_RESET',
          entityType: 'User',
          entityId: String(user.id)
        }
      });
    }

    res.json({ message: 'Password updated' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  verifyEmail,
  forgotPasswordController,
  resetPasswordController
};