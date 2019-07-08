var mongoose = require('mongoose');

var middleWare = mongoose.Schema({
	url: { type: String, default: '' },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	appVersion: { type: String, default: '' },
	payloadData: {},
	response: {},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

mongoose.model('middleWare', middleWare);