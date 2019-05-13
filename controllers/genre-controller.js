var Genre = require('../models/genre')

// Display list of all Genre.
exports.genreList = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre list')
}

// Display detail page for a specific Genre.
exports.genreDetail = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id)
}

// Display Genre create form on GET.
exports.genreCreateGet = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create GET')
}

// Handle Genre create on POST.
exports.genreCreatePost = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create POST')
}

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