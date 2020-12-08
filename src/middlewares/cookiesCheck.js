function cookiesCheck(req,res,next) {
    if (req.cookies.userEmail !== undefined) {
        req.session.userLogged = req.cookies.userEmail;}
        next();
};

module.exports = cookiesCheck