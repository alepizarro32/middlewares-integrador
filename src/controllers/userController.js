const path = require('path');
const fs = require('fs');
//const multer = require ('multer')
const {check, validationResult, body} = require('express-validator'); 
const bycrypt = require('bcrypt');
const { fileLoader } = require('ejs');
const { getMaxListeners } = require('process');


const usersFilePath = path.join(__dirname,'../database/users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, {encoding:'utf-8'}));

const writeData = function(data,filePath){
    let stringUsers = JSON.stringify(data, null," ");
    fs.writeFileSync(filePath, stringUsers)
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
        console.log(errors)
        if (!errors.isEmpty()){
            return res.render('user/user-register-form', {errors:errors.errors})
        } else {
            newUserID = newID();
            let newUser ={
                id: newUserID,
                email:req.body.email,
                password:bycrypt.hashSync(req.body.password, 10),
                avatar:'default-image.png'
            }
            if (req.files[0]){
                newUser.avatar=req.files[0].filename; 
            }
            let usersToSave = [...users, newUser];
            writeData(usersToSave, usersFilePath);
            return res.render('user/profile', {user:newUser})};
    },
    showLogin: (req, res) => {
        return res.render('user/user-login-form');
    },
    processLogin: (req, res) => {
        let errors = validationResult(req);
        
        if (!errors.isEmpty()){
            return res.render('user/user-login-form', {errors:errors.errors})
        }else{
            let userFound = users.find(function(user){return user.email == req.body.email})
                if(!bycrypt.compareSync(req.body.password, userFound.password)){
                res.render('user/user-login-form', {errors:[{param:"password", msg:"Contraseña incorrecta"}]})  
                } else {
                req.session.userLogged = userFound.email;
                    if (req.body.remember!=undefined){
                    res.cookie('userEmail',userFound.email,{maxAge:1000*60});
                    }
                return res.render('user/profile', {user:userFound})
            }
            };
    },
    showProfile: (req, res) => {
        let userFound = users.find(function(user){return user.email == req.userEmail})
        return res.render('user/profile',{user:userFound});
    },
    logout: (req, res) => {
        res.cookie('userEmail'," ",{maxAge:-60});
        req.session.userLogged = undefined;
        return res.redirect('/');
    }

}
