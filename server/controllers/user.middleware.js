module.exports =  isAuth = (req, res, next) => {
    // Check if the user session is defined and has a userId property
    if (req.session && req.session.userID) {
        // User is authenticated, proceed to the next middleware or route

        next();
    } else {
        // User is not authenticated, send an error response
        res.redirect("/")
    }
};