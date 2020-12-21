const jwt = require('jsonwebtoken');

const myKey = '99999';

exports.generateToken = (user) => {
    const payload = JSON.stringify(user);
    const token = jwt.sign(payload, myKey);
    return token;
};

exports.validateToken = (token) => {
    let decoded = {};

    try {
        decoded = jwt.verify(token, myKey);
    } 
    catch (error) {
        console.log(`An error occurred during token validation: ${error}.`);
        return null;
    }
    return decoded;
}