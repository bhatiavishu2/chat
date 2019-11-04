const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const url = "mongodb+srv://admin:admin@cluster0-kcfft.mongodb.net/test?retryWrites=true&w=majority";

const connect = mongoose.connect(url, { useNewUrlParser: true });

module.exports = connect;
