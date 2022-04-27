const mongoose = require("mongoose");

const isAdmin = currentUser => currentUser.role === 'ADMIN'

module.exports = isAdmin;
