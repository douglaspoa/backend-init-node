// ./seed.js
const dotenv = require('dotenv');
dotenv.config(); // carrega as variáveis de ambiente
const Crypto = require("crypto");
const md5 = require('md5');

const mongoose = require('mongoose');
const chance = require('chance').Chance();
const User = require('./src/models/User');
const Role = require('./src/models/Role');
const Category = require('./src/models/Category');

const server = process.env.MONGO_INITDB_SERVER;
const username = process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const database = process.env.MONGO_INITDB_DATABASE;
const port = process.env.MONGO_INITDB_PORT;
const authSource = process.env.MONGO_INITDB_AUTHSOURCE;

const connectionString = `mongodb://${username}:${password}@${server}:${port}/${database}?authSource=${authSource}`;

async function seed() {
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected...'))
        .catch((err) => console.log(err));

    await User.deleteMany({});
    await Role.deleteMany({});
    await Category.deleteMany({});

    const categories = [
        'Esporte',
        'Futebol',
        'Lazer',
    ];


    for (let i in categories) {
        const category = new Category({
            name: categories[i]
        });

        await category.save()
    }

    const roles = [
        'admin',
        'editor chefe',
        'jornalista',
        'redator'
    ];

    for (let i in roles) {
        const role = new Role({
            name: roles[i]
        });

        await role.save()
    }

    // Create 10 random users
    for (let i = 0; i < 10; i++) {
        const user = new User({
            name: chance.name(),
            email: chance.email(),
            password: chance.string({ length: 8 }),
            id_account: new mongoose.Types.ObjectId(),
            id_role: new mongoose.Types.ObjectId(),
            active: true,
        });

        await user.save();
    }

    const rolesList = await Role.find();
    const rolesObj = {}

    rolesList.forEach((currentRole)=>{
        if(currentRole.name.toLowerCase() ==  "admin"){
            rolesObj['admin'] = currentRole.id
        }
        if(currentRole.name.toLowerCase() ==  "editor chefe"){
            rolesObj['editor_chefe'] = currentRole.id
        }
        if(currentRole.name.toLowerCase() ==  "jornalista"){
            rolesObj['jornalista'] = currentRole.id
        }
        if(currentRole.name.toLowerCase() ==  "redator"){
            rolesObj['redator'] = currentRole.id
        }
    })


    // Admin User
    const user_admin = new User({
        name: "Teste Admin",
        email: "admin@denakop.com",
        password: md5("12345678"),
        id_role: new mongoose.Types.ObjectId(rolesObj['admin'] ),
        active: true,
    });

    await user_admin.save();

    // Redator chefe User
    const user_chefe = new User({
        name: "Teste Redator Chefe",
        email: "chefe@denakop.com",
        password: md5("12345678"),
        id_role: new mongoose.Types.ObjectId(rolesObj['editor_chefe']),
        active: true,
    });

    await user_chefe.save();

    // Jornalista User
    const user_jornalista = new User({
        name: "Teste Jornalista",
        email: "jornalista@denakop.com",
        password: md5("12345678"),
        id_role: new mongoose.Types.ObjectId(rolesObj['jornalista']),
        active: true,
    });

    await user_jornalista.save();

    // Redator User
    const user_redator = new User({
        name: "Teste Redator",
        email: "redator@denakop.com",
        password: md5("12345678"),
        id_role: new mongoose.Types.ObjectId(rolesObj['redator']),
        active: true,
    });

    mongoose.connection.close();
}

seed().catch(console.error);
