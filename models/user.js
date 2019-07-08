var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	email: { type: String, default: '', trim: true },
	userName: { type: String, default: '', trim: true },
	password: { type: String, default: '', trim: true },
	countryCode: { type: String, default: '', trim: true },
	phoneNumber: { type: String, default: '', trim: true },
	dob: { type: Date, default: '' },
	gender: { type: String, default: '', trim: true },
	address: { type: String, default: '', trim: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	lastLoginTime: { type: Date, default: Date.now }
}, { usePushEach: true }) // usePushEach is used to perform $pushAll as it is not supported in mongo 3.6);

userSchema.methods.generateHash = async (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    if (!this.password) { return false; }
    return bcrypt.compareSync(password, this.password);
};

mongoose.model('User', userSchema);