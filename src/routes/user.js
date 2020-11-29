const express = require('express');
const router = express.Router();
const multer = require('multer');
const {check, validationResult, body} = require('express-validator'); 
const fs = require('fs');
const path = require('path')

const usersFilePath = path.join(__dirname,'../database/users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, {encoding:'utf-8'}));

const avatarsFilePath = path.join(__dirname,'../../public/images/users');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, avatarsFilePath)
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "_" + path.basename(file.originalname, path.extname(file.originalname)) +'_' + Date.now() + path.extname(file.originalname))
    }
  })
  var upload = multer({ storage: storage })

const userController = require('../controllers/userController');
const { extname } = require('path');

// Muestra la vista de registro
router.get('/register', userController.showRegister);

// Procesa la vista de registro
router.post('/register',/*[
    check('email').isEmail().withMessage('El email ingresado no es válido.'),
    check('password').isLength({min:8}).withMessage('La contraseña debe tener al menos 8 caracteres.'),
    body('retype').custom(function(value, {req}){
        if (req.body.password == req.body.retype){
            return true} 
        return false
    }).withMessage('Las contraseñas no coinciden.'),
    body('email').custom(function(value){
        if (users == ""){
            users = [];
        }else{
            for (user of users){
                if (user.email == value){
                    return false
                }
            }
        return true
        }
    }).withMessage('El email ya está en uso.')

] ,*/upload.any(), userController.processRegister);

// Muestra la vista de login
router.get('/login', userController.showLogin);

// Procesa la vista de login
router.post('/login', userController.processLogin);

// Muestra el perfil del usuario
router.get('/profile', userController.showProfile);

// Cierra la sesión
router.get('/logout', userController.logout);


module.exports = router;