const express = require ( 'express');
const expressJwt = require ( 'express-jwt');
const config = require ( '../../config/config');
const userRoutes = require ( './user.route');
const authRoutes = require ( './auth.route');
const invitationRoutes = require ( './invite.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/users', userRoutes);

router.use('/auth', authRoutes);

router.use('/invitations', invitationRoutes);

module.exports = router;
