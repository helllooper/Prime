var mongoose = require("mongoose");

var bookedSchema = new mongoose.Schema({
    name:String,
    phone:String,
    email:String,
    doctor:String,
    date:{type: Date, default: Date.now()}
});

module.exports = mongoose.model("Booked", bookedSchema);