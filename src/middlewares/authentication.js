// ./src/middlewares/authentication.js
const JsonWebToken = require("jsonwebtoken");

module.exports = function (req, res, next) {
    let Auth = req.cookies.Token || null;

    if (typeof (Auth) == 'undefined' || Auth === '' || Auth == null) {
        throw new Error('user not authorized');
    } else {
        try {
            JsonWebToken.verify(Auth, 'SiriToken')
            return true;
        } catch (error) {
            throw new Error('user not authorized');
        }
    }
}
