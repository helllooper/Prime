var mongoose = require("mongoose");

var emailsSchema = new mongoose.Schema({
    email:String
});

module.exports = mongoose.model("Email", emailsSchema);