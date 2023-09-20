const Router = require('express');
const router = new Router();
const user = require('../controllers/user.controller.js');
const isAuth= require('../controllers/user.middleware.js');

router.post('/registration', user.register)
router.post('/login',  user.login)

router.post('/logout', user.logout)

router.delete('/delete', user.delete)

router.get('/user',isAuth ,user.getUsers)

router.get('/acc', isAuth, user.userAcc)

router.get('/checkAuth', (req,res) => {
    if(req.session && req.session.userID) {
        res.json({authenticated: true})
    }else {
        res.json({authenticated: false})
    }
})

module.exports = router