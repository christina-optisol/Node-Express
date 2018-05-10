const Promise  =  require('bluebird');
const mongoose  =  require ('mongoose');
const httpStatus  =  require ('http-status');
const APIError  =  require ('../helpers/APIError');
const EmailService  =  require ('../services/email.service');

/**
 * Invitation Schema
 */
const InvitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending'
  },
  updatedAt: {
    type: Date
  },
  createdAt: {
    type: Date
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

InvitationSchema.pre('save', function setTimestamp(next) {
  const now = new Date();
  const user = this;

  user.updatedAt = now;
  if (!user.createdAt) {
    user.createdAt = now;
  }
  next();
});

InvitationSchema.post('save', (invite) => {
  if (invite.status === 'pending') {
    EmailService.invitation({ to: invite.email, invite: invite.id });
  }
});

/**
 * Methods
 */
InvitationSchema.method({
});

/**
 * Statics
 */
InvitationSchema.statics = {

  get(id) {
    return this.findById(id)
      .exec()
      .then((invitation) => {
        if (invitation) {
          return invitation;
        }
        const err = new APIError('No such invitation exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};


module.exports = mongoose.model('Invitation', InvitationSchema);
