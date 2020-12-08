function authMiddleware(req,res,next){
    if (req.session.userLogged || req.cookies.userEmail) {
        req.userEmail = req.session.userLogged ? req.session.userLogged : req.cookies.userEmail;
        next();
    } else {
        res.redirect('/user/login');
    }
};

module.exports = authMiddleware;