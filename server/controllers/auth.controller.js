const jwt  = require ('jsonwebtoken');
const httpStatus  = require ('http-status');
const OTP  = require ('otp-generator');
const APIError  = require ('../helpers/APIError');
const config  = require ('../../config/config');
const User  = require ('../models/user.model');
const EmailService  = require ('../services/email.service');
const Twilio  = require ('../services/twilio.service');

function generateToken(user) {
  const token = jwt.sign({
    username: user.username,
    email: user.email,
    id: user._id
  }, config.jwtSecret);
  return token;
}

function login(req, res, next) {
  const { username, password } = req.body;
  const criteria = (username.indexOf('@') === -1) ? { username } : { email: username };
  const query = User.findOne(criteria)
  query.then((user) => { // eslint-disable-line consistent-return
    if (user) {
      user.comparePassword(password, (err, valid) => {
        if (err) {
          return next(new APIError('Internal Server Error', httpStatus.BAD_REQUEST, true));
        }
        if (!valid) {
          return next(new APIError('Invalid Password', httpStatus.BAD_REQUEST, true));
        }

        const token = jwt.sign({
          username: user.username,
          email: user.email,
          role: user.role,
          id: user._id
        }, config.jwtSecret);

        return res.json({
          token,
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            phoneNumber: user.phoneNumber
          },
          role: user.role
        });
      });
    } else {
      const err = new APIError('Invalid Email or Username', httpStatus.BAD_REQUEST, true);
      return next(err);
    }
  });
}

function loginOtp(req, res, next) {
  const { otp } = req.body;
  User.findOne({ otp }).then((user) => {
    if (user) {
      const token = jwt.sign({
        username: user.username,
        email: user.email,
        role: user.role,
        id: user._id
      }, config.jwtSecret);

      return res.json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username,
          phoneNumber: user.phoneNumber
        },
        role: user.role
      });
    }
   else {
    const err = new APIError('Invalid Email or Username', httpStatus.BAD_REQUEST, true);
    return next(err);
  }
});
}


function recieveOtp(req, res, next) {
  const { phoneNumber } = req.body;
  User.findOne({ phoneNumber: phoneNumber }).then((user) => { // eslint-disable-line consistent-return
    if (user) {
      const otp = OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      // Send OTP to phoneNumber given 
      user.otp = otp; // eslint-disable-line no-param-reassign
      user.save()
        .then((savedUser) => { // eslint-disable-line consistent-return
            Twilio.smsOTP({ otp: savedUser.otp, phoneNumber: savedUser.phoneNumber });
            return res.json({ message: 'OTP SMS sent!' });
          }) .catch(() => {
            next(new APIError('Internal Server Error', httpStatus.INTERNAL_SERVER_ERROR, true));
          });
    } else {
        return next(new APIError('This phone number is not registered', httpStatus.BAD_REQUEST, true));
      }
    }).catch(() => {
      next(new APIError('Internal Server Error', httpStatus.INTERNAL_SERVER_ERROR, true));
    });
}

function forgotPassword(req, res, next) {
  const { email } = req.body;
  const criteria = (email.indexOf('@') === -1) ? { phoneNumber: email } : { email };
  const isEmail = !(email.indexOf('@') === -1);

  const query = User.findOne(criteria);
  query.then((user) => { // eslint-disable-line consistent-return
    if (user) {
      // Generate and set OTP to user
      const otp = OTP.generate(6, { upperCase: false, specialChars: false, alphabets: false });
      // Send OTP Email if email given
      user.otp = otp; // eslint-disable-line no-param-reassign
      user.save()
        .then((savedUser) => { // eslint-disable-line consistent-return
          if (isEmail) {
            const emailParams = {
              firstName: savedUser.firstName,
              to: savedUser.email,
              otp: savedUser.otp
            };
            EmailService.forgotPassword(emailParams);
            res.json({ message: 'OTP Email sent!' });
          } else {
            Twilio.smsOTP({ otp: savedUser.otp });
            return res.json({ message: 'OTP SMS sent!' });
          }
        })
        .catch(() => {
          next(new APIError('Internal Server Error', httpStatus.INTERNAL_SERVER_ERROR, true));
        });
      // Send OTP SMS if phone number given
    } else {
      if (isEmail) {
        return next(new APIError('This email is not registered', httpStatus.BAD_REQUEST, true));
      }
      return next(new APIError('Phone number not registered', httpStatus.BAD_REQUEST, true));
    }
  });
}

function verifyOTP(req, res) {
  const { otp } = req.body;
  User.findOne({ otp }).then((user) => {
    if (user) {
      return res.json({ valid: true });
    }
    return res.status(400).json({ valid: false });
  });
}

function resetPassword(req, res, next) {
  const { otp, newPassword } = req.body;
  User.findOne({ otp }).then((user) => { // eslint-disable-line consistent-return
    if (user) {
      user.password = newPassword; // eslint-disable-line no-param-reassign
      user.otp = ''; // eslint-disable-line no-param-reassign
      user.save().then(() => res.json({ message: 'Password reset successfully' }));
    } else {
      return next(new APIError('Invalid OTP', httpStatus.INTERNAL_SERVER_ERROR, true));
    }
  }).catch(err => next(new APIError(err, httpStatus.INTERNAL_SERVER_ERROR, true)));
}

function socialLogin(req, res, next) {
  const socialInfo = req.body;
  User.findOne({ email: socialInfo.email }).then((user) => {
    if (user) {
      if ((socialInfo.linkedinId && socialInfo.linkedinId === user.linkedinId)
      || (socialInfo.facebookId && socialInfo.facebookId === user.facebookId)
      || (socialInfo.googleId && socialInfo.googleId === user.googleId)) {
        res.status(200).json({
          token: generateToken(user),
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          },
          role: user.role
        });
      } else {
        res.status(422).json({
          message: 'email already exists'
        });
      }
    } else {
      const userInfo = new User(socialInfo);
      userInfo.save()
        .then((savedUser) => {
          EmailService.welcomeEmail({ firstName: savedUser.firstName, toEmail: savedUser.email });
          Role.findOne({ name: 'Global Admin' })
          .then((role) => {
            res.status(200).json({
              token: generateToken(savedUser),
              user: {
                id: savedUser._id,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email
              },
              role
            });
          });
        })
        .catch(e => res.status(400).json(e));
    }
  }).catch(err => next(new APIError(err, httpStatus.INTERNAL_SERVER_ERROR, true)));
}

module.exports = { login, forgotPassword, resetPassword, verifyOTP, socialLogin, loginOtp, recieveOtp };
