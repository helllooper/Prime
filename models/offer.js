var mongoose = require("mongoose");

var offerSchema = new mongoose.Schema({
    switch:String,
    text:String
});

module.exports = mongoose.model("Offer", offerSchema);