const mongoose = require('mongoose')

const Schema = mongoose.Schema

const authorSchema = new Schema({
    firstName : {type: String, /*,required: true*/ max:100},
    familyName : {type: String, /*,required: true*/ max:100},
    dateOfBirth : {type: Date},
    dateOfDeath : {type: Date}
})

// Virtual for author's full name
authorSchema
.virtual('name')
.get(function(){
    return this.familyName + ', ' + this.firstName
})

// Virtual for author's lifespan
authorSchema
.virtual('lifespan')
.get(function(){
    if(this.dateOfBirth === undefined || this.dateOfDeath === undefined) return 'Unknown'
    if(this.dateOfBirth === null || this.dateOfDeath === null) return 'Unknown'
    return (this.dateOfDeath.getYear() - this.dateOfBirth.getYear()).toString()
})

// Virtual for author's URL
authorSchema
.virtual('url')
.get(function(){
    return '/catalog/author/' + this._id
})

module.exports = mongoose.model('Author', authorSchema)