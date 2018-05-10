const Invitation = require ('../models/invitation.model');

function load(req, res, next, id) {
  Invitation.get(id)
    .then((invitation) => {
      req.invitation = invitation; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.invitation);
}

module.exports = { load, get };
