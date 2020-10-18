const express = require('express');
const port = process.env.port || 3000;
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const NodeCouchDb = require('node-couchdb'); // https://www.npmjs.com/package/node-couchdb

// CouchDB authentication
const couch = new NodeCouchDb({
    auth: {
        user: 'admin',
        password: 'admin'
    }
});

const dbName = 'library';
const viewUrl = '_design/books/_view/all';

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

// Cookie parser setup & setting static directory
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Render index page
app.get('/', function (req, res) {
    couch.get(dbName, viewUrl).then(({
        data,
        headers,
        status
    }) => {
        res.render('index', {
            books: data.rows
        });
    }, err => {
        res.send(err);
    });
});

// Start app on port 3000
app.listen(port, function () {
    console.log('Server started on port ' + port);
});