const bookInstance = require('../models/bookInstance')
const {body, validationResult} = require('express-validator/check')
const { sanitizeBody} = require('express-validator/filter')
const book = require('../models/book')

// Display list of all bookInstances.
exports.bookInstanceList = function(req, res) {
    bookInstance.find()
    .populate('book')
    .exec(function(err, listBookInstances) {
        if (err) { return next(err) }
        res.render('bookInstance-list', {title : 'Book Instance List', bookInstanceList: listBookInstances})

    })
}

// Display detail page for a specific bookInstance.
exports.bookInstanceDetail = function(req, res, next) {
    bookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookInstance) {
        if(err) {return next(err)}
        if(bookInstance==null){
            const err = new Error('Book copy not found')
            err.status = 404
            return next(err)
        }
        res.render('bookInstance-detail', {title: 'Book:', bookInstance: bookInstance })
    })
}

// Display bookInstance create form on GET.
exports.bookInstanceCreateGet = function(req, res) {
    book.find({}, 'title')
    .exec(function(err, books){
        if(err) {return next(err)}
        res.render('bookInstance-form', {title: 'Create Book Instance', bookList: books})
    })
}

// Handle bookInstance create on POST.
exports.bookInstanceCreatePost = [
    //Validate fields
    body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
    body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
    body('dueBack', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
    
    // Sanitize fields.
    sanitizeBody('book').escape(),
    sanitizeBody('imprint').escape(),
    sanitizeBody('status').trim().escape(),
    sanitizeBody('dueBack').toDate(),

    //Process request after validation and sanitization
    (req, res, next) => {
        //Extract the validation errors from a request
        const errors = validationResult(req)

        //Create a bookInstance object with escaped and trimmed data
        const BookInstance = new bookInstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                dueBack: req.body.dueBack
            })

        if(!errors.isEmpty()){
            // There are errors. Render form again with sanitized values and error messages
            book.find({}, title)
            .exec(function (err, books){
                if(err) return next(err)
                res.render('bookInstance-form', {title : 'Create bookInstance', bookList: books, selectedBook: bookInstance.book._id, errors: errors.array(), bookinstance: BookInstance })
            })
            return
        }
        //data from form is valid
        BookInstance.save(function(err){
            if (err) return next(err)
            res.redirect(BookInstance.url)
        })

    }
]

// Display bookInstance delete form on GET.
exports.bookInstanceDeleteGet = function(req, res) {
    res.send('NOT IMPLEMENTED: bookInstance delete GET')
}

// Handle bookInstance delete on POST.
exports.bookInstanceDeletePost = function(req, res) {
    res.send('NOT IMPLEMENTED: bookInstance delete POST')
}

// Display bookInstance update form on GET.
exports.bookInstanceUpdateGet = function(req, res) {
    res.send('NOT IMPLEMENTED: bookInstance update GET')
}

// Handle bookInstance update on POST.
exports.bookInstanceUpdatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: bookInstance update POST')
}