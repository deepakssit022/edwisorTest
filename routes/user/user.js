const user = require('../../controllers/user/user');
const auth = require('../../middleware/authentication');

module.exports = function (app, upload) {
    app.post('/user/signUp', upload.any(), user.signUp);
    app.post('/user/login', user.login);
}