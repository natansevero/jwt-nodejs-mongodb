var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/user-jwt');

var UserSchema   = new Schema({
    email: String,
    password: String,
    token: String
});

module.exports = mongoose.model('User', UserSchema);
