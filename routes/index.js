module.exports = function (app, upload) {
    require("./user/user")(app, upload);
}