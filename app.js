const app = require('express')(),
    bodyParser = require('body-parser'),
    chalk = require('chalk'),
    cookieParser = require('cookie-parser'),
    dotenv = require ('dotenv/config'),
    mongoose = require('mongoose');

const port = process.env.PORT || 8080;
const db = require('./config/config').get(process.env.NODE_ENV);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());

const public = require('./routes/public');
app.use('/', public);

mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE,{
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) console.log(err);

    console.clear();
    console.log("Successful connection to MongoDB server", chalk.green('✓'));
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
});

module.exports = app;