const bookInstance = require('../models/bookInstance')

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
    .populate('Book')
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
    res.send('NOT IMPLEMENTED: bookInstance create GET')
}

// Handle bookInstance create on POST.
exports.bookInstanceCreatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: bookInstance create POST')
}

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