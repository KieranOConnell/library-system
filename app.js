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
const allBooksView = '_design/books/_view/allBooks';
const totalBooksView = '_design/books/_view/noBooks';

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
    couch.get(dbName, allBooksView).then(({
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

// Render total books page
app.post('/books/total', function (req, res) {
    couch.get(dbName, totalBooksView).then(({
        data,
        headers,
        status
    }) => {
        res.render('total', {
            totals: data.rows
        });
    }, err => {
        res.send(err);
    });
});

// Add book route
app.post('/book/add', function (req, res) {
    const title = req.body.title;
    const author = req.body.author;
    const publisher = req.body.publisher;
    const pages = req.body.pages;
    const genre = req.body.genre;
    const protagonist = req.body.protagonist;
    const antagonist = req.body.antagonist;
    const release_date = req.body.release_date;
    const rating = req.body.rating;

    couch.uniqid().then(function (ids) {
        const id = ids[0];

        couch.insert(dbName, {
            _id: id,
            title: title,
            author: author,
            pages: pages,
            publishers: [publisher],
            characters: {
                protagonist: protagonist,
                antagonist: antagonist
            },
            genre: genre,
            release_date: release_date,
            rating: rating
        }).then(({
            data,
            headers,
            status
        }) => {
            res.redirect('/');
        }, err => {
            res.send(err);
        });
    });
});

// Delete book route
app.post('/book/delete/:id', function (req, res) {
    const id = req.params.id;
    const rev = req.body.rev;

    couch.del(dbName, id, rev).then(({
        data,
        headers,
        status
    }) => {
        res.redirect('/');
    }, err => {
        res.send(err);
    });
});

// Update book route
app.post('/book/update', function (req, res) {
    const id = req.body.bookId;
    const rev = req.body.rev;
    const title = req.body.title;
    const author = req.body.author;
    const publisher = req.body.publisher;
    const pages = req.body.pages;
    const genre = req.body.genre;
    const protagonist = req.body.protagonist;
    const antagonist = req.body.antagonist;
    const release_date = req.body.release_date;
    const rating = req.body.rating;

    couch.update(dbName, {
        _id: id,
        _rev: rev,
        title: title,
        author: author,
        pages: pages,
        publishers: [publisher],
        characters: {
            protagonist: protagonist,
            antagonist: antagonist
        },
        genre: genre,
        release_date: release_date,
        rating: rating
    }).then(({
        data,
        headers,
        status
    }) => {
        res.redirect('/');
    }, err => {
        res.send(err);
    });
});

// Start app on port 3000
app.listen(port, function () {
    console.log('Server started on port ' + port);
});

module.exports = app;