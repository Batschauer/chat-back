const express = require('express');
const { open } = require('fs');
const app = express();
const port = 3031;

app.get('/singup', async(req, res) => {
    const { userName, password } = req.query;

    let fileHandle = null;

    try {
        fileHandle = await open('./data/users.json', 'a+');
        fileHandle.
    } finally {
        await fileHandle ? .close();
    }

    res.send(`Hello World: ${req.query}`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});