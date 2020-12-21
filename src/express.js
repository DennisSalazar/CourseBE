const express = require('express')
const app = express()
const port = 4444

const bp = require('body-parser');
app.use(bp.json());

/********************* Put this in a middleware*/
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Token'
    );
    next();
  });
/********************* */

const usersData = require('./data.json');
const tokenManager = require('./jwt');

app.get('/', (req, res) => {
    res.json({
        status: "success",
        data: usersData.users
    });
});


app.post('/auth', (req, res) => {

    const data = req.body;

    const user = usersData.users.find(u => { return u.name === data.name && u.password === data.password });
    
    if ( user ) {
        console.log('user is valid!');
        const token = tokenManager.generateToken(data);
        const name = data.name;

        res.json({
            name,
            token
        });
    }
    else {
        console.log('user is invalid!');
        res.status(403)//403 Forbidden
        res.send('Invalid username or password');
    }

});

app.get('/users', (req, res) => {

    const token = req.headers['token'];
    console.log(`Token in header is: ${token}`);

    const verificationResponse = tokenManager.validateToken(token);
    if ( verificationResponse !== null ) {
        res.json({
            status: "success",
            data: usersData.users
        });
    }
    else {
        res.status(401);//401 Unauthorized
        res.send('Unauthorized!!');
    }


});

app.listen(port, () => {
    console.log(`My Express API listening at port ${port}!`)
});