// ./src/controllers/userController.js
const User = require('../models/User');
const Role = require("../models/Role");
const JsonWebToken = require("jsonwebtoken");

exports.getAllUsers = async (req, res, next) => {
    try {
        if (!req.params.accountId) {
            next().status(400).send('Account id is required');
        }

        const users = await User.find({ id_account: req.params.accountId },{ password: 0, token: 0 });

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId, { password: 0 , token: 0 });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    const token = req.cookies.Token
    const authTokenDecoded = JsonWebToken.verify(token, 'SiriToken');

    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const roleUser = await Role.findOne({_id: user.id_role}, {password: 0, token: 0});

        if (!roleUser) {
            res.status(401).json({message: "Role not found"})
        }

        if (authTokenDecoded._id === req.params.userId) {

            Token = await JsonWebToken.sign({
                id: user._id,
                nome: user.name,
                email: user.email,
                role: roleUser.name,
            }, 'SiriToken');

            res.cookie('Token', Token);
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

exports.impersonateUser = async (req, res, next) => {
    const token = req.cookies.Token
    const authTokenDecoded = JsonWebToken.verify(token, 'SiriToken');

    if (authTokenDecoded.role !== 'admin') {
        res.status(401).json({message: "User not authorized"})
    }

    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const roleUser = await Role.findOne({_id: user.id_role});

        if (!roleUser) {
            return res.status(404).json({ message: 'Role not found' });
        }

        Token = await JsonWebToken.sign({
            id: user._id,
            nome: user.name,
            email: user.email,
            role: roleUser.name,
        }, 'SiriToken');

        res.cookie('Token', Token);
        res.status(200).json({ message: 'User impersonate'});
    } catch (error) {
        next(error);
    }
};
