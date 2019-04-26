const express = require('express');
const app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('express-favicon');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
require('dotenv').config();
var port = process.env.PORT || 8080;

app.use(favicon(__dirname+'/public/img/favicon.png'));
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine','ejs');
//connecting to mongodb
mongoose.connect(process.env.DB_URI,{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error',function(err){
    console.log(err);
})
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));
// adding controllers
app.use('/admin', require('./controllers/adminController.js'));
require('./controllers/seoControllers')(app);
require('./controllers/postController')(app);

//catching 404 errors
app.use((req,res)=>{
    res.status(404).send(`Page not found. \n <a href="/">back to home</a>`);
});

app.get('/sitemap.xml',(req,res)=>{
    res.setHeader("content-Type","application/xml");
    res.send('<urlset><url>Han</url></urlset>');
});

app.listen(port,(err)=>{
    if(err)throw err;
    console.log("Running @ port "+port);
});