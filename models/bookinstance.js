const mongoose = require('mongoose')
const moment = require('moment')

const Schema = mongoose.Schema

const bookInstanceSchema = new Schema({
    book: {type: Schema.Types.ObjectId, ref: 'Book' /*, required: true*/},
    imprint: {type: String,required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    dueBack: {type: Date, default: Date.now}
})

// Virtual for bookInstance's URL
bookInstanceSchema
.virtual('url')
.get(function(){
    return '/catalog/bookInstance/' + this._id
})

bookInstanceSchema
.virtual('dueBackFormatted')
.get(function () {
    return moment(this.dueBack).format('MMMM.Do, YYYY')
})

module.exports = mongoose.model('bookInstance', bookInstanceSchema)