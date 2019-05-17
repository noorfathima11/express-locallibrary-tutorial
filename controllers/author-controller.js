const author = require('../models/author')
const async = require('async')
const book = require('../models/book')
const {body, validationResult} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')

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
exports.authorCreateGet = function(req, res, next) {
    res.render('author-form', {title: 'Create Author'})
}

// Handle author create on POST
exports.authorCreatePost = [
    //Validate fields
    body('firstName').isLength({ min: 1}).trim().withMessage('First name should be specified')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters'),
    body('familyName').isLength({ min: 1}).trim().withMessage('Family name should be specified')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters'),
    body('dateOfBirth', 'Invalid date of birth').optional({ checkFalsy: true}).isISO8601(),
    body('dateOfDeath', 'Invalid date of death').optional({ checkFalsy: true}).isISO8601(),

    //Sanitize fields
    sanitizeBody('firstName').escape(),
    sanitizeBody('familyName').escape(),
    sanitizeBody('dateOfBirth').toDate(),
    sanitizeBody('dateOfDeath').toDate(),

    //Process request after validation and sanitization
    (req, res, next) => {

        const errors = validationResult(req)

        if(!errors.isEmpty()){
            res.render('author-form', {title: 'Create Author', author : req.body, errors : errors.array()})
            return
        }

        const Author = new author({
            firstName : req.body.firstName,
            familyName : req.body.familyName,
            dateOfBirth : req.body.dateOfBirth,
            dateOfDeath : req.body.dateOfDeath
        })

        Author.save(function(err){
            if(err) {return next(err)}
            res.redirect(Author.url)
        })
    }
]


// Display author delete form on GET
exports.authorDeleteGet = function(req, res) {
    async.parallel({
        getAuthor: function(callback) {
            author.findById(req.params.id).exec(callback)
        },
        authorsBooks : function(callback){
            book.find({'author' : req.params.id }).exec(callback)
        }
    },
    function (err, results){
        if(err) return next(err)
        if(results.getAuthor === null) res.redirect('/catalog/authors')
        res.render('author-delete', {title: 'Delete author', getAuthor: results.getAuthor, authorsBooks: results.authorsBooks})
    }
    )
}

// Handle author delete on POST
exports.authorDeletePost = function(req, res, next) {
   async.parallel({
       getAuthor: function(callback){
           author.findById(req.params.id).exec(callback)
       },
       authorsBooks : function(callback){
           book.find({'author' : req.body.authorid}).exec(callback)
       }
   },
   function(err, results){
       if(err) return next(err)
       //Success
       if(results.authorsBooks.length > 0){
       //Author has some books. Render in same way as for GET route
       res.render('author-delete', {title: 'Delete author', getAuthor: results.getAuthor, authorsBooks: results.authorsBooks})
       return
    }
     //Author has no books. Delete object and redirect to the list of authors
     author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.redirect('/catalog/authors')
    })

   })
}

// Display author update form on GET
exports.authorUpdateGet = function(req, res){
    res.send('NOT IMPLEMENTED: Author update GET')
}

// Handle author update on POST
exports.authorUpdatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST')
}
