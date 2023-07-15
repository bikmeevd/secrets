require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('User',userSchema);


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    async function createNewUser() {
        try {
            await newUser.save();
            res.render('secrets');
        } catch (err) {
            console.log(err);
        }
    }
    createNewUser();
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    async function findUser() {
        try {
            const foundUser = await User.findOne({email: username})
            if (foundUser.password === password) {
                res.render('secrets');
            }
        } catch (err) {
            console.log(err)
        }
    }
    findUser();
});








app.listen(3000, function() {
    console.log('listening on port 3000')
});
