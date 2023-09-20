const Router = require('express');
const router = new Router();
const cart = require('../controllers/cart.controller.js');
const isAuth= require('../controllers/user.middleware.js');

const multer = require('multer');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_APISECRET
});
const storage = multer.diskStorage({});

const upload = multer({
    storage,
    limits: { fieldSize: 25 * 1024 * 1024 } // Set appropriate limits for your application
});


router.post('/cart',isAuth,cart.addToCart)
router.post('/newProduct', isAuth, cart.createNewProduct)
router.post('/carts',cart.FillCart)
router.delete('/cart',isAuth, cart.removeFromCart)
router.get('/storeCart',isAuth, cart.storeCart)
router.post('/plus', isAuth, cart.plusQuant)
router.post('/minus', isAuth, cart.minusQuant)
router.post('/nodemailer', isAuth, cart.nodeMailer)
router.post('/upload',isAuth, upload.single('file'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path); // Upload the file to Cloudinary
        const absoluteURL = result.secure_url; // Get the absolute URL from Cloudinary's response
        res.json({ url: absoluteURL }); // Send the URL back to the client
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});


module.exports = router