const express = require ( 'express');
const validate = require ( 'express-validation');
// const expressJwt = require ( 'express-jwt');
const paramValidation = require ( '../../config/param-validation');
const authCtrl = require ( '../controllers/auth.controller');
// const config = require ( '../../config/config');

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

router.route('/recieve-otp')
  .post(authCtrl.recieveOtp);

router.route('/login-otp')
  .post(authCtrl.loginOtp);

router.route('/forgot-password')
  .post(authCtrl.forgotPassword);

router.route('/reset-password')
  .post(validate(paramValidation.resetPassword), authCtrl.resetPassword);

// router.route('/verify-otp')
//   .post(authCtrl.verifyOTP);

router.post('/send_otp', authCtrl.sendOTPFirebase);
router.get('/verify_otp/:otp', authCtrl.verifyOTPFirebase);

/** POST /api/auth/sociallogin - Returns token */
// router.route('/sociallogin')
//   .post(validate(paramValidation.socialLogin), authCtrl.socialLogin);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
// router.route('/random-number')
//   .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

module.exports = router;
