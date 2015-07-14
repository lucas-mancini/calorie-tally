var request = require('supertest');

/** Perform a GET using a token for authentication
  * @param {String} url Where to make request
  * @param {String} route To use on the request
  * @param {String} token Authentication token
  * @return {Object} request object */
exports.getRequestWithToken = function(url, route, token) {
    return request(url).get(route).set('x-access-token', token);
};

/** Perform a POST using a token for authentication
  * @param {String} url Where to make request
  * @param {String} route To use on the request
  * @param {String} token Authentication token
  * @return {Object} request object */
exports.postRequestWithToken = function(url, route, token) {
    return request(url).post(route).set('x-access-token', token);
};

/** Perform a PUT using a token for authentication
  * @param {String} url Where to make request
  * @param {String} route To use on the request
  * @param {String} token Authentication token
  * @return {Object} request object */
exports.putRequestWithToken = function(url, route, token) {
    return request(url).put(route).set('x-access-token', token);
};

/** Perform a DELETE using a token for authentication
  * @param {String} url Where to make request
  * @param {String} route To use on the request
  * @param {String} token Authentication token
  * @return {Object} request object */
exports.deleteRequestWithToken = function(url, route, token) {
    return request(url).del(route).set('x-access-token', token);
};
