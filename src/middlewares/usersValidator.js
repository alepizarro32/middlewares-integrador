const { body, check } = require("express-validator")
const fs = require('fs');
const path = require('path')
const usersFilePath = path.join(__dirname,'../database/users.json');
const usersList = JSON.parse(fs.readFileSync(usersFilePath, {encoding:'utf-8'}));

const usersValidator= {
    register: [
        body('email')
        .notEmpty().withMessage('Email vacío')
        .bail()
        .isEmail().withMessage('El email debe ser una dirección válida')
        .bail()
        .custom(
            function(value, {req}){
                let userFound = usersList.find(function(user){return user.email==value});
                if (userFound){return false}else{ return true}
            }
        )
        .withMessage('El email ya está registrado'),
        body('password').isLength({min:8}).withMessage('La contraseña debe tener al menos 8 caracteres')
        .bail(),
        body('retype').custom(function(value, {req}){
            if (value == req.body.password) {
                return true
            } else {
                return false
            }
        }).withMessage('Las contraseñas no coinciden.'),
        body('avatar')
        .custom(function(value,{req}){
            if (req.files[0]){return true} else {return false}
        }).withMessage('El avatar es obligatorio')
        .bail()
        .custom(function(value,{req}){
            let validExt = ['.png', '.jpg', '.jpeg']
            let fileExt = path.extname(req.files[0].originalname)
            let foundExt = validExt.find(function(ext){return ext==fileExt})
            if (foundExt){return true} else {return false}
        }).withMessage('Los formatos admitidos son .jpg, .jpeg o .png')
    ],
    login: [
        body('email')
        .notEmpty()
        .withMessage('Email vacío')
        .bail()
        .custom(
            function(value, {req}){
                let userFound = usersList.find(function(user){return user.email==value});
                if (userFound){return true}else{ return false}
            }
        )
        .withMessage('El usuario no existe')
        .bail(),
        body('password')
        .isLength({min:8}).withMessage('La contraseña debe tener 8 caracteres.')
        .bail()
    ]
}

module.exports = (usersValidator)