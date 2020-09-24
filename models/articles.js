var mongoose = require("mongoose");

var articlesSchema = new mongoose.Schema({
    title: String,
    author: String,
    body:String,
    image: String,
    imageId:String,
    date:{type: Date, default: Date.now}
});

module.exports = mongoose.model("Article", articlesSchema);