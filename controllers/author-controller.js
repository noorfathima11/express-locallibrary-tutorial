const author = require('../models/author')
const async = require('async')
const book = require('../models/book')

// Display list of all Authors
exports.authorList = function(req, res) {
    author.find()
    .sort([['familyName', 'ascending']])
    .exec(function (err, listAuthors) {
        if(err) {return next(err)}
        res.render('author-list', {title: 'Author List', authorList: listAuthors})
    })
}

// Display detail page for a specific author
exports.authorDetail = function(req, res, next) {
    async.parallel({
        getAuthor : function(callback){
            author.findById(req.params.id)
            .exec(callback)
        },
        authorsBooks : function(callback) {
            book.find({'author' : req.params.id}, 'title summary')
            .exec(callback)
        },
    }, function(err, results){
        if(err) {return next(err)}
        if(results.getAuthor==null){
            const err = new Error('Author not found')
            err.status = 404
            return next(err)
        }
        res.render('author-detail', {title: 'Author Detail', getAuthor: results.getAuthor, authorsBooks: results.authorsBooks })
    }
    )
}

// Display author create form on GET
exports.authorCreateGet = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET')
}

// Handle author create on POST
exports.authorCreatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST')
}

// Display author delete form on GET
exports.authorDeleteGet = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET')
}

// Handle author delete on POST
exports.authorDeletePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST')
}

// Display author update form on GET
exports.authorUpdateGet = function(req, res){
    res.send('NOT IMPLEMENTED: Author update GET')
}

// Handle author update on POST
exports.authorUpdatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST')
}