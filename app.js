const express = require('express');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb') // https://www.npmjs.com/package/node-couchdb

// CouchDB authentication
const couch = new NodeCouchDb({
    auth: {
        user: 'admin',
        password: 'admin'
    }
});

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Favicon & body parser setup
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Render index page
app.get('/', function (req, res) {
    res.render('index');
});

// Start app on port 3000
app.listen(3000, function () {
    console.log('Server started on port 3000');
});