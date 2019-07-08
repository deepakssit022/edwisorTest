const async = require('async');

/*
 * ------------------------------------------------------
 * Check if manadatory fields are not filled
 * INPUT : array of field names which need to be mandatory
 * OUTPUT : Error if mandatory fields not filled
 * ------------------------------------------------------
 */
// exports.checkBlank = function (res, manValues, callback) {
//     var checkBlankData = checkBlank(manValues);
//     if (checkBlankData) {
//         return res.status(400).send({ success: false, message: 'Some parameter missing' });
//     }
//     else {
//         callback(null);
//     }
// }

// function checkBlank(arr) {

//     var arrlength = arr.length;

//     for (var i = 0; i < arrlength; i++) {
//         console.log(i)
//         console.log(arr[i])
//         if (arr[i] == '') {
//             return 1;
//             break;
//         }
//         else if (arr[i] == undefined) {
//             return 1;
//             break;
//         }
//         else if (arr[i] == '(null)') {
//             return 1;
//             break;
//         }
//     }
//     return 0;
// }

exports.checkBlank = async (res, manValues) => {
    var object = manValues[0];
    for (var prop in object) {
        if (object[prop] == undefined || object[prop] == 'undefined' || object[prop] == '') {
            return { success: false, message: 'Oops!, ' + prop + ' is missing!' };
        } else {
            return 0;
        }
    }
}