const book = require('../models/book')
const author = require('../models/author')
const genre = require('../models/genre')
const bookInstance = require('../models/bookInstance')

const async = require('async')

exports.index = function(req, res){
    async.parallel({
        bookCount: function(callback) {
            book.countDocuments({}, callback) // Pass an empty object as match condition to find all documents of this collection
        },
        bookInstanceCount: function(callback) {
            bookInstance.countDocuments({}, callback)
        },
        bookInstanceAvailableCount: function(callback) {
            bookInstance.countDocuments({status:'Available'}, callback)
        },
        authorCount: function(callback) {
            author.countDocuments({}, callback)
        },
        genreCount: function(callback) {
            genre.countDocuments({}, callback)
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results })
    })
}

// Display list of all books.
exports.bookList = function(req, res) {
    book.find({}, 'title author')
    .populate('author')
    .exec(function(err, listBooks){
        if(err) {return next(err) }
        res.render('book-list', {title : 'Book List', bookList : listBooks})
    })

}

// Display detail page for a specific book.
exports.bookDetail = function(req, res, next) {
    async.parallel({
        getBook : function(callback) {
            book.findById(req.params.id)
            .populate('author')
            .populate('genre')
            .exec(callback)
        },
        bookInstances : function(callback) {
            bookInstance.find({'book' : req.params.id})
            .exec(callback)
        },
    }, function(err, results){
        if(err) {return next(err)}
        if(results.getBook===null){
            const err = new Error('Book not found')
            err.status = 404
            return next(err)
        }
        res.render('book-detail', {title: 'Title', getBook: results.getBook, bookInstances: results.bookInstances})
    }

    )
}

// Display book create form on GET.
exports.bookCreateGet = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET')
}

// Handle book create on POST.
exports.bookCreatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST')
}

// Display book delete form on GET.
exports.bookDeleteGet = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET')
}

// Handle book delete on POST.
exports.bookDeletePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST')
}

// Display book update form on GET.
exports.bookUpdateGet = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET')
}

// Handle book update on POST.
exports.bookUpdatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST')
}

