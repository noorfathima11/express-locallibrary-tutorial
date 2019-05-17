const genre = require('../models/genre')
const book = require('../models/book')
const async = require('async')
const {body, validationResult} = require('express-validator/check')
const {sanitizeBody} = require('express-validator/filter')

// Display list of all Genre.
exports.genreList = function(req, res) {
    genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, listGenres){
        if(err) {return next(err)}
        res.render('genre-list', {title: 'Genre List', genreList: listGenres})
    })

}

// Display detail page for a specific Genre.
exports.genreDetail = function(req, res, next) {
    async.parallel({
        getGenre: function(callback){
            genre.findById(req.params.id)
            .exec(callback)
        },

        genreBooks : function(callback){
            book.find({'genre' : req.params.id})
            .exec(callback)
        },
    },
        function(err, results){
            if (err) {return next(err)}
            if (results.getGenre==null){
                const err = new Error('Genre not found')
                err.status = 404
                return next(err)
            }
            res.render('genre-detail', {title: 'Genre Detail', getGenre: results.getGenre, genreBooks: results.genreBooks})
    })

}

// Display Genre create form on GET.
exports.genreCreateGet = function(req, res, next) {
    res.render('genre-form', {title: 'Create Genre'})
}

// Handle Genre create on POST.
exports.genreCreatePost =  [
    //validate that the name of the field is not empty
    body('name', 'Genre name required').isLength({min: 1}).trim(),

    //Sanitize (escape the name field)
    sanitizeBody('name').escape(),

    //Process request after validation and sanitization
    (req, res, next) => {

        //Extract the validation errors from a request
        const errors = validationResult(req)

        //Create a genre object with escaped and trimmed data
        const Genre = new genre(
            {name : req.body.name}
        )

        if(!errors.isEmpty()){
            //There are errors. Render again with sanitized values/error messages
            res.render('genre-form', {title : 'create genre', genre : Genre, errors: errors.array()})
            return
        }
        //Data from form is valid
        // Check if genre with same name already exists
        genre.findOne({'name' : req.body.name })
        .exec(function(err, foundGenre){
            if(err) {return next(err)}

            if(foundGenre){
            //Genre exists, redirect it to its detail page
            res.redirect(foundGenre.url)
            } else {
                Genre.save(function(err){
                    if(err) {return next(err)}
                    // Genre saved, redirect to genre detail page
                    res.redirect(Genre.url)
                })
            }
        })
    }
]

// Display Genre delete form on GET.
exports.genreDeleteGet = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET')
}

// Handle Genre delete on POST.
exports.genreDeletePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST')
}

// Display Genre update form on GET.
exports.genreUpdateGet = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET')
}

// Handle Genre update on POST.
exports.genreUpdatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST')
}