const { requiresAuth } = require('express-openid-connect');

export const isLoggedIn = requiresAuth