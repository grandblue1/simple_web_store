const database = require('../bd/db')
const fs = require("fs");

const nodemailer = require('../service/nodemailer.js')

class CartController {
    async addToCart(req, res) {
        try {
            const { userID, productID } = req.body;
            const quantity = 1; // Assuming quantity is always 1

            // Check if the product exists
            const productInfo = await database.query("SELECT * FROM products WHERE id = $1", [productID]);

            if (productInfo.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found.' });
            }

            // Check if the user has an existing cart item for this product
            const existingCartItem = await database.query("SELECT * FROM user_cart WHERE user_id = $1 AND product_id = $2", [userID, productID]);

            if (existingCartItem.rows.length === 0) {
                // If the user doesn't have this product in the cart, add it
                const cart = await database.query("INSERT INTO user_cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *", [userID, productID, quantity]);

                // Return product information
                res.json({ productInfo: productInfo.rows[0], cartItem: cart.rows[0] });
            } else {
                // If the user already has this product in the cart, update the quantity
                const updatedCart = await database.query("UPDATE user_cart SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *", [quantity, userID, productID]);
                // Return updated cart item
                res.json({cartItem :  updatedCart.rows[0]});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error.' });
        }
    }

    async createNewProduct(req,res){
        const {name,cost,image_url,description} = req.body;

        if(name && cost && image_url && description) {
            const product = await database.query(`INSERT INTO products (name,cost,image_url,description) VALUES ($1,$2,$3,$4) RETURNING *`, [name,cost,image_url,description])
            res.status(200).json(product.rows[0])
        }
        else{
            res.status(404).send('Invalid request')
        }

    }
    async plusQuant(req, res){
        const {productID}  = req.body
        const checkQuantity = await database.query("SELECT * from user_cart where product_id =$1", [productID])

        let updatedCart = await database.query("UPDATE user_cart SET quantity = quantity + 1  where product_id = $1 RETURNING *", [productID]);
        if(updatedCart.rows[0].quantity <= 0){
            updatedCart = await database.query("UPDATE user_cart SET quantity =0 where product_id = $1 RETURNING *", [productID])
        }

        res.json(updatedCart.rows[0]);
    }
    async minusQuant(req,res) {
        const {productID} = req.body ;
        let updatedCart = await database.query("UPDATE user_cart SET quantity = quantity - 1  where product_id = $1 RETURNING *", [productID]);
        if(updatedCart.rows[0].quantity <= 0){
            updatedCart = await database.query("UPDATE user_cart SET quantity =0 where product_id = $1 RETURNING *", [productID])
        }
        res.json(updatedCart.rows[0]);
    }

    async FillCart(req,res){
        try{
            const {userID} = req.body;

            const user = await database.query("SELECT * FROM user_cart WHERE user_id =$1",[userID])
            const items = []

            if(user.rows.length < 0){
                console.log("Cart is empty")
            }
            for(let i = 0; i < user.rows.length; i++){
                const productID = user.rows[i].product_id;
                const products = await database.query("SELECT * FROM products WHERE id = $1", [productID])
                items.push(products.rows[0])
            }
            res.status(200).json({cartItem: user.rows, productInfo: items})

        }catch(e){
            console.log(e);
        }

    }

    async storeCart(req,res) {
        try{
            const products = await database.query('SELECT id, name, cost, image_url, description FROM products')
            res.json(products.rows)
        }catch(e){
            console.log(e)
            res.status(404).send('Error: seems you haven\'nt get a products by some reason :', e)
        }

    }

    async getUserCart(req, res) {
        try {
            const userID = req.params.userID;
            const userCartItems = await database.query(
                'SELECT p.id, p.name, p.cost, p.image_url, p.description, uc.quantity FROM user_cart uc INNER JOIN products p ON uc.product_id = p.id WHERE uc.user_id = $1',
                [userID]
            );
            res.json(userCartItems.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async removeFromCart(req, res) {
        try {
            const {userID, productID} = req.body;

            const deletedCartItem = await database.query(
                'DELETE FROM user_cart WHERE user_id = $1 AND product_id = $2 RETURNING *',
                [userID, productID]
            );

            if (deletedCartItem.rows.length === 0) {
                res.status(404).json({ error: 'Cart item not found' });
            } else {
                res.json(deletedCartItem.rows[0]);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    async nodeMailer(req,res) {
        try{
            const {id,name,surname,email,phone,address} = req.body;
            const user_products = await database.query('select * from user_cart where user_id = $1', [id])
            const products = []
            for(let i=0; i<user_products.rows.length; i++){
                const product = await database.query('select * from products where id = $1', [user_products.rows[i].product_id])
                products.push(product.rows[0])
            }
            const data = {
                products: products,
                name : name,
                surname : surname,
                email : email,
                phone : phone,
                address: address
            }
            await nodemailer.sendMail(email,data);
            res.status(200).send('Success')
        }catch(err){
            console.log(err)
        }

    }
}

module.exports = new CartController();

