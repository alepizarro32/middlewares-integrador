const path = require('path');
const fs = require('fs');
const usersFilePath = path.join(__dirname,'../database/users.json');
const users = JSON.parse(fs.readFileSync(usersFilePath, {encoding:'utf-8'}));

function sessionCheck(req,res,next) {
    if (req.session.userLogged != undefined) {
        req.session.userLogged;
        let userFound = users.find(function(user){return user.email == req.session.userLogged});
        res.locals.userLogged = {
            email: userFound.email,
            avatar: userFound.avatar
            } 
        } else {
            res.locals.userLogged = {
                email: undefined,
                avatar: undefined
            }
        };
        next();
};

module.exports = sessionCheck