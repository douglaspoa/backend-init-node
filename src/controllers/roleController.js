// ./src/controllers/roleController.js
const Role = require('../models/Role');

exports.createRole = async (req, res, next) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        next(error);
    }
};

exports.getAllRoles = async (req, res, next) => {
    try {
        const role = await Role.find({});
        if (!role) {
            return res.status(404).json({ message: 'Roles not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        next(error);
    }
};

exports.getRole = async (req, res, next) => {
    try {
        const role = await Role.findById(req.params.roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        next(error);
    }
};

exports.updateRole = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.roleId, req.body, { new: true });
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json(role);
    } catch (error) {
        next(error);
    }
};

exports.deleteRole = async (req, res, next) => {
    try {
        const role = await Role.findByIdAndRemove(req.params.roleId);
        if (!role) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.status(200).json({ message: 'Role deleted' });
    } catch (error) {
        next(error);
    }
};
