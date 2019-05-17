const book = require('../models/book')
const author = require('../models/author')
const genre = require('../models/genre')
const bookInstance = require('../models/bookInstance')
const {body, validationResult} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')

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
exports.bookCreateGet = function(req, res, next) {
    // Get all authors and genres which we can use to adding to our book
    async.parallel({
        authors : function(callback){
            author.find(callback)
        },
        genres : function(callback){
            genre.find(callback)
        }
    },
        function (err, results) {
            if(err) { return next(err)}
            res.render('book-form', {title: 'Create Book', authors: results.authors, genres: results.genres})
    })
}

// Handle book create on POST.
exports.bookCreatePost = [
    // Convert the genre to an array
    (req, res, next) => {
        console.log('first print')
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined') { req.body.genre = [] }
            else { req.body.genre = new Array(req.body.genre) }
        }
        next()
    },

    //Validate fields
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard)
    sanitizeBody('*').escape(),

    //Process request after validation and sanitization
    (req, res, next) => {
        console.log('validated and sanitized')
        const errors = validationResult(req)

        const Book = new book({
            title : req.body.title,
            author : req.body.author,
            summary : req.body.summary,
            isbn : req.body.isbn,
            genre : req.body.genre
        })

        if(!errors.isEmpty()){
            console.log('There is an error1')
             // There are errors. Render form again with sanitized values/error messages.

             //Get all authors and genres for form
             async.parallel({
                 authors: function(callback){
                     author.find(callback)
                 },
                 genres: function(callback){
                     genre.find(callback)
                 }
                },
                 function(err, results){
                    console.log('There is an error2')

                     if(err) {return next(err)}

                     //Mark our selected genres as checked
                     for(let i = 0; i < results.genre.length; i++){
                         if(Book.genre.indexOf(results.genres[i]._id) > -1){
                             results.genres[i].checked = 'true'
                         }
                     }
                     res.render('book-form', {title: 'Create Book', authors: results.authors, genres: results.genres, book:Book, errors: errors.array() })
                 })
             return
        }else{
            //Data from form is valid save book
            console.log('valid')
            Book.save(function(err){
                console.log(Book.url)
                if(err) return(next(err))
                res.redirect(Book.url)

            })
        }
    }
]

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
    // Get book, authors and genres for form
    async.parallel({
        getBook : function(callback){
            book.findById(req.params.id).populate('author').populate('genre').exec(callback)
        },
        getAuthor : function(callback){
            author.find(callback)
        },
        getGenres : function(callback){
            genre.find(callback)
        }
    }, function(err, results){
        if(err) return next(err)
        if(results.getBook === null) {
            const err = new Error('Book not found')
            err.status = 404
            return next(err)
        }
        //Success, Mark our selected genres as checked
    }
    )
}

// Handle book update on POST.
exports.bookUpdatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST')
}

