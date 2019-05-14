const book = require('../models/book')
const author = require('../models/author')
const genre = require('../models/genre')
const bookInstance = require('../models/bookInstance')

const async = require('async')

exports.index = function(req, res){

    async.parallel({
        bookCount : function(callback) {
            book.countDocuments({}, callback)
        },
        bookInstanceCount : function(callback) {
            bookInstance.countDocuments({}, callback)
        },
        bookInstanceAvailableCount : function(callback) {
            bookInstance.countDocuments({status: 'Available'}, callback)

        },
        authorCount : function(callback) {
            author.countDocuments({}, callback)
        },
        genreCount : function(callback) {
            genre.countDocuments({}, callback)
        }
    },
    function(err, results){
        res.render('index', {title: 'Local Library Home', error: err, data: results })
    })
}

