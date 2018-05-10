const Joi = require ('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      organisation: Joi.string().optional(),
      baseURL: Joi.string().optional(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().regex(/[0-9]{10}/).required(),
      password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required().options({ language: { string: { regex: { base: 'should be atleast 8, having One Caps, One Number, and One special character' } }, label: 'Password' } }),
      confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' }, label: 'Password Confirmation' } })
    }
  },

  // POST /api/auth/sociallogin
  socialLogin: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      department: Joi.string(),
      role: Joi.string(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().regex(/[0-9]{10}/).required(),
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // /api/auth/reset-password
  resetPassword: {
    body: {
      otp: Joi.string().required(),
      newPassword: Joi.string().required().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).options({ language: { string: { regex: { base: 'should be atleast 8, having One Caps, One Number, and One special character' } }, label: 'Password' } }),
      confirmPassword: Joi.any().valid(Joi.ref('newPassword')).options({ language: { any: { allowOnly: 'must match password' }, label: 'Password Confirmation' } })
    }
  },

  // POST /api/users
  createDepartment: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().allow(null).allow(''),
      cpdPoints: Joi.number().integer(),
      cpdEnabled: Joi.boolean().required(),
    }
  },


  // POST /api/courses
  createCourse: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      validity: Joi.number().required(),
      duration: Joi.number().required(),
      mandatory: Joi.boolean().required(),
      privacy: Joi.boolean().required(),
      dates: Joi.array().required(),
      seats: Joi.number().required(),
      trainerType: Joi.string().required(),
      phoneNumber: Joi.alternatives()
        .when('trainerType', { is: 'external', then: Joi.string().regex(/[0-9]{10}/).required(), otherwise: Joi.string().optional().allow(null) }),
      email: Joi.alternatives()
        .when('trainerType', { is: 'external', then: Joi.string().email().required(), otherwise: Joi.string().optional().allow(null) }),
      trainer: Joi.alternatives()
        .when('trainerType', { is: 'internal', then: Joi.string().required(), otherwise: Joi.string().optional().allow(null) }),
      location: Joi.string().required(),
      links: Joi.array()
    }
  },


  // POST /api/usergroups
  createUsergroup: {
    body: {
      name: Joi.string().required(),
      internalTrainers: Joi.array().items(Joi.string()).required(),
      externalTrainers: Joi.array().items(Joi.string()).required(),
      users: Joi.array().items(Joi.string()).required(),
      departmentAdmin: Joi.string().required()
    }
  },

   // POST /api/usergroups
  createCertificate: {
    body: {
      name: Joi.string().required(),
      template: Joi.string().required(),
      signature: Joi.string().required()
    }
  },

  createPolicy: {
    body: {
      name: Joi.string().required(),
      policyDoc: Joi.any().required(),
      deadLine: Joi.string().optional().allow(null).allow(''),
      privacy: Joi.boolean().optional().allow(null).allow(''),
      department: Joi.any().optional().allow(null).allow(''),
      userGroup: Joi.any().optional().allow(null).allow(''),
      description: Joi.string().optional().allow(null).allow('')
    }
  },


    // POST /api/myskills
  createMyskills: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().optional().allow(null).allow(''),
      duration: Joi.number().optional().allow(null).allow(''),
      fromDate: Joi.date().optional().allow(null).allow(''),
      toDate: Joi.date().optional().allow(null).allow(''),
      phoneNumber: Joi.string().regex(/[0-9]{10}/).optional().allow(null)
        .allow(''),
      email: Joi.string().email().optional().allow(null)
        .allow('')
    }
  },

  // POST /api/book-course
  bookCourse: {
    body: {
      courseId: Joi.string().required(),
      userId: Joi.string().required()
    }
  },

  // POST /api/sign-policy
  signPolicy: {
    body: {
      policyId: Joi.string().required(),
      userId: Joi.string().required()
    }
  },

  // POST /api/folder
  folder: {
    body: {
      name: Joi.string().required()
    }
  },

  // POST /api/reflectivenote
  createReflectiveNote: {
    body: {
      description: Joi.string().required()
    }
  },

  // PUT /api/userinfo
  updateUserInfo: {
    body: {
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      email: Joi.string().required(),
      additionalEmails: Joi.array().items().optional(),
      password: Joi.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).optional().options({ language: { string: { regex: { base: 'should be atleast 8, having One Caps, One Number, and One special character' } }, label: 'Password' } })
    }
  }
};
