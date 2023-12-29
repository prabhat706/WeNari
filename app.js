const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')
const dotenv = require('dotenv')
const router = require('./routes/shop.js')
const authRouter = require('./routes/auth');
const Product = require('./models/product');

dotenv.config('/env');

// importing models
const User = require('./models/user');

// package to define the session and maintain the cross site forgery
const MONGODB_URI = process.env.MONGODB_URI
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const csrfProtection = csrf();

// storing session in database
const store = MongoDbStore({
    uri: MONGODB_URI,
    collection: 'session'
});
const app = express()

const Storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'saree_images');
    },
    filename: (req, file, cb) => {

        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
})
const upload = multer({
    storage: Storage
}).single('image')

// PUBLIC
app.use(express.static(path.join(__dirname, 'public')))
app.use('/saree_images', express.static(path.join(__dirname, 'saree_images')));
app.use(express.urlencoded({ extended: true }))

// Setting views
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

// multer use
app.use(upload);

// setting up the session 
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store
}))

// CSURF use
app.use(csrfProtection);

app.use((req, res, next) => {

    // we can now directly use this variables (csrfToken, isLoggedIn, admin, fname) in our views file, now we don't need to pass these values from the controller when doing render!

    res.locals.csrfToken = req.csrfToken();
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.admin = req.session.admin;
    if (req.session.user) res.locals.fname = req.session.user.name.split(' ')[0];

    next();
})
// Routes
app.use(router);
app.use(authRouter);

// MONGOOSE connection and port listening
mongoose.connect(MONGODB_URI)

    .then(() => {

        let port = process.env.PORT

        app.listen(port, () => console.log("Server started successfully"))
    })
    .catch(err => {
        console.log("Some Error in connection");
    })