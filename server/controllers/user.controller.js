const flatMapDeep  = require ('lodash');
const User = require ('../models/user.model');
const EmailService = require ('../services/email.service');


// Basic CRUD for user create,update,delete,get

function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.user);
}

function create({ body }, res) {
console.log(body)
  const users = new User(body);
   users.save().then((savedUser) => {
      EmailService.welcomeEmail({ firstName: savedUser.firstName, toEmail: savedUser.email });
      res.json(savedUser);
    }).catch(e =>  res.json(e));
}

function update(req, res, next) {
  const user = req.user;
  user.email = req.body.email;
  user.phoneNumber = req.body.phoneNumber;
  user.save()
    .then((savedUser) => {
      User.findById(savedUser._id).then((usr) => {
        res.json(usr);
      });
    })
    .catch(e => next(e));
}

function list(req, res, next) {
  const { page = 1, limit = 10, search } = req.query;
  User.list({ page, limit, search })
    .then(users => res.json(users))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then((deletedUser) => {
      BookCourse.find({ user: user._id }).remove().exec().then(() => {
        Attendance.find({ user: user._id }).remove().exec().then(() => {
          res.json(deletedUser);
        })
        .catch(e => next(e));
      })
      .catch(e => next(e));
    })
    .catch(e => next(e));
}

module.exports ={
  load,
  get,
  create,
  update,
  list,
  remove
};
