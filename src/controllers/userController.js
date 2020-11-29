const path = require('path');
const fs = require('fs');
//const multer = require ('multer')
const {check, validationResult, body} = require('express-validator'); 
const bycrypt = require('bcrypt');
const { fileLoader } = require('ejs');


const usersFilePath = path.join(__dirname,'../database/users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, {encoding:'utf-8'}));

const writeUsers = function(array){
    let stringUsers = JSON.stringify(array, null,1);
    fs.writeFileSync(usersFilePath, stringUsers)
}

const newID = function(){
    let lastID = (users[users.length-1].id)
    return ++lastID
}

module.exports = {
    showRegister: (req, res) => {
        return res.render('user/user-register-form');
    },
    processRegister: (req, res, next) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors)
            return res.render('user/user-register-form', {errors:errors.errors})
        } else {
            let newUser ={
                id: newID(),
                email:req.body.email,
                password:bycrypt.hashSync(req.body.password, 10),
                avatar:req.files[0].filename
            }
            let usersToSave = JSON.stringify([...users, newUser]);
            console.log(usersToSave)
            // crear una variable de objeto literal con el nuevo usuario (en la cual debemos hashear la contraseña y poner el nombre de la imagen
            // crear un array tomando los usuarios y agregando el nuevo usuario
    
            // escribir en la base de datos
            return res.send('Registro completo')};
    },
    showLogin: (req, res) => {
        // Do the magic
        return res.send('Do the magic');
    },
    processLogin: (req, res) => {
        // Do the magic
        return res.send('Do the magic');
    },
    showProfile: (req, res) => {
        return res.render('user/profile');
    },
    logout: (req, res) => {
        // Do the magic
        return res.redirect('/');
    }

}
