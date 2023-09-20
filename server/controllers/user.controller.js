const uuid = require('uuid').v4;
const database = require('../bd/db')
const session = require('express-session');
const path = require('path')

class UserController {
    async register(req, res) {
        try {
            const { email, password } = req.body;


            const existingUser = await database.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // If the email is not registered, create a new user
            const newUser = await database.query(
                'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
                [email, password]
            );
            req.session.userID = newUser.rows[0].id;
            req.session.save((err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: 'Session save error' });
                } else {
                    res.status(201).json(newUser.rows[0]);


                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async login(req,res){
        try {
            const {email, password} = req.body;

            const user = await database.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [email, password]);
            if(user.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid login or password' });
            }
            req.session.userID = user.rows[0].id;

            req.session.save((err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ error: 'Session save error' });
                } else {
                    res.status(200).json({ message: 'Login successful', user: user.rows[0], session: req.session });


                }
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({ error: "Internal server error"})
        }
    }
    async logout(req, res) {
        try {
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            // res.status(200).json({ message: 'Logout successful' });

            res.writeHead(301, {
                Location: `/`
            }).end();
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Logout failed' });
        }
    }

    async getUsers(req,res){
        const user = await database.query(`SELECT * FROM users`);
        if(user === 0){
            res.status(401).send("You are not logged in");
        }
        res.json(user.rows);
    }
    async delete(req,res){
        const id = req.query.id;
        const user = await database.query("DELETE FROM users WHERE id = $1", [id]);
    }
    async userAcc(req,res){
        if(req.session.cookie) {
            res.sendFile(path.resolve(__dirname,'../../client/public','user.html'))
        }else {
            res.redirect('/');
        }
    }

    async getOne(req,res){ // /user:id GET
        const id = req.params.id ;
        const user = await database.query(`SELECT * FROM users WHERE id = $1`, [id] );

        res.json(user.rows[0]);
    }
}

module.exports = new UserController();
