const express =  require ( 'express');
// const validate =  require ( 'express-validation');
// const paramValidation =  require ( '../../config/param-validation');
const inviteCtrl =  require ( '../controllers/invitation.controller');

const router = express.Router(); // eslint-disable-line new-cap

router.route('/:inviteId')
  /** GET /api/invites/:inviteId - Get invite */
  .get(inviteCtrl.get);

/** Load invite when API with inviteId route parameter is hit */
router.param('inviteId', inviteCtrl.load);

module.exports = router;
