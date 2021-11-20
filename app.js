const express = require('express');
const { readFile, writeFile } = require('fs');
const app = express();
const port = 3031;

app.get('/singup', async(req, res) => {
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');

    const { userName, password } = req.query;
    console.log('Query: ', req.query);
    
    const storageUsers = await require('./data/users.json');
    let _users = storageUsers ? storageUsers['users'] : [];

    let newUser = {
        id: _users.length + 1,
        userName: userName,
        password: password,
        publicKey: '@TODO',
    };

    _users.push(newUser);

    const json = JSON.stringify({ users: _users });
    await writeFile('./data/users.json', json, { flag: 'w+' }, function(e) {
        //console.log('Error: ', e);
    });

    res.send(`private key`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});