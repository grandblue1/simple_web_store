const express = require('express');
const PORT = process.env.PORT || 3000;
const route = require('./routes/user.route.js');
const cart_route = require('./routes/cart.route.js');
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session);
const database = require('./bd/db');
const path =require('path');



const uuid = require('uuid').v4;

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use(express.json());

app.use(express.static(path.resolve(__dirname, "..", "client" , 'public')))
app.use(express.static(path.resolve(__dirname, "..", "client" , 'src')))
app.use(express.static(path.resolve(__dirname, "..", "client" , 'public', "image")))

app.use(session({
    store: new pgSession({
        pool: database,
        tableName: "sessions",
    }),
    secret: "admin",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60,
    },
    genid: (req) => {
        return uuid();
    }
}))




app.use('/', route);
app.use('/user', cart_route );



app.listen(PORT, () => `${PORT}`);