// ./src/models/Role.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: {
        type: String,
        enum: [ 'admin', 'editor chefe', 'jornalista', 'redator'],
        default: 'user',
        required: true
    }
});

module.exports = mongoose.model('Role', RoleSchema);
