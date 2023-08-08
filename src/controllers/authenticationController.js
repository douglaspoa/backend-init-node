// ./src/controllers/authenticationController.js
const User = require('../models/User');
const Role = require('../models/Role');
const JsonWebToken = require('jsonwebtoken');
const Crypto = require("crypto");
const md5 = require('md5');
// const {sendEmail} = require("../amazon/ses");
const chance = require('chance').Chance();

exports.login = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(401).json({message: 'Fields email and password are required'});
        }

        const user = await User.findOne({email: req.body.email, password: md5(req.body.password)});

        if (!user) {
            return res.status(401).json({message: 'E-mail or password not match'});
        }

        if (user.active === false) {
            return res.status(401).json({message: 'User inactive'});
        }

        const roleUser = await Role.findOne({_id: user.id_role});

        if (!roleUser) {
            res.status(401).json({message: "User not authorized"})
        }

        Token = await JsonWebToken.sign({
            id: user._id,
            nome: user.name,
            email: user.email,
            role: roleUser.name,
        }, 'BluwiToken');

        res.cookie('Token', Token);
        res.status(200).json({message: Token})

    } catch (error) {
        next(error)
    }
};

exports.logout = (req, res, next) => {
    res.clearCookie('Token').status(200).json({message: "User has disconnected"})
};

exports.forgotPassword = async (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({message: 'Field email required'});
    }

    const user = await User.findOne({email: req.body.email});

    if (!user) {
        return res.status(400).json({message: 'Email not found'});
    }
    try {
       // await sendEmail([req.body.email], "Recuperação de senha BluWi", this.getTemplateEmail(user.token, "forgotPassword"))
        console.log("Email enviado para recuperação de senha")
    } catch (error) {
        return res.status(400).json({message: 'Email not send'});
    }
    await user.save();

    return res.status(200).json({message: 'Email has sended'})
};

exports.newPasswordWithToken = async (req, res, next) => {
    if (!req.body.token || !req.body.password) {
        return res.status(401).json({message: 'not authorized'});
    }

    const user = await User.findOne({token: req.body.token});

    if (!user) {
        return res.status(400).json({message: 'Token not match'});
    }

    user.password = md5(req.body.password);
    user.active = true;
    user.token = chance.string({ length: 6, casing: 'upper', alpha: true, numeric: true })
    await user.save();

    return res.status(200).json({message: 'Password has been changed'})
};

exports.newPasswordLogged = async (req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.newPassword) {
        return res.status(401).json({message: 'not authorized'});
    }
    const user = await User.findOne({email: req.body.email, password: md5(req.body.password)});

    if (!user) {
        return res.status(400).json({message: 'Email or password not match'});
    }

    user.password = md5(req.body.newPassword)
    await user.save();

    return res.status(200).json({message: 'Password has been changed'})
};

exports.register = async (req, res, next) => {
    if (!req.body.name || !req.body.email) {
        return res.status(400).json({message: 'Fields name and email are required'});
    }

    const verifyUser = await User.findOne({email: req.body.email});

    if (verifyUser) {
        return res.status(400).json({message: 'User alredy created'});
    }

    const token = chance.string({ length: 6, casing: 'upper', alpha: true, numeric: true })

    try {
        // await sendEmail([req.body.email], "Bem vindo ao BluWi", this.getTemplateEmail(token, "register"))
    } catch (error) {
        return res.status(400).json({message: 'Email not send'});
    }

    const payload = {
        email: req.body.email.trim(),
        name: req.body.name.trim(),
        password: md5(chance.string({ length: 8 })),
        id_role: req.body.id_role,
        token: token
    }
    try {
        const user = new User(payload);
        await user.save();
        res.status(201).json({message: "User Created"});
    } catch (error) {
        next(error);
    }
};

exports.getTemplateEmail = (token, type) => {
    if (type === "register") {
        return `<table width="900" style="width: 900px; margin: 10px auto; padding: 0;"  cellpadding="0" cellspacing="0" border="0">
        <tbody>
        </tbody>
    </table>`
    } else if (type === "forgotPassword") {
        return `<table style="width: 900px; margin: 10px auto;"  cellpadding="0" cellspacing="0" border="0">
        <tbody>
        </tbody>
    </table>`
    }
}
