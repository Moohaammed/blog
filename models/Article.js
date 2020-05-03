const mongoose = require('mongoose');
const date = new Date();
const formatedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
console.log(formatedDate);
const ArticleSchema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    articleBody: {
        type: String,
        required: true
    },
    dbDate: {
        type: Date,
        default: Date.now
    },
    date: {
        type: String,
        default: formatedDate
    }

})    

module.exports = mongoose.model('Article', ArticleSchema);