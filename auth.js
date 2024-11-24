const bcrypt = require('bcrypt');
const { User } = require('./database');
const saltRounds = 10;

const hashPassword = async (password) => {
    return bcrypt.hash(password, saltRounds);
};

const comparePasswords = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

const authenticateUser = async (username, password) => {
    const user = await User.findOne({ where: { username } });
    if (user && await comparePasswords(password, user.password)) {
        return user;
    }
    return null;
};

const ensureAuthenticated = (req, res, next) => {
    if (req.user) {
        return next();
    }
    res.redirect('/login');
};

const ensureAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.status(403).send('Access Denied: Admin only');
};

module.exports = {
    hashPassword,
    comparePasswords,
    authenticateUser,
    ensureAuthenticated,
    ensureAdmin
};