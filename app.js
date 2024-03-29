const express = require('express');
const cors = require('cors');
const { getMessages, sendMessage } = require('./utils/message');
const { addUser, findUser, getUsers } = require('./utils/user');
const app = express();
const port = 3031;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options('*', cors());

app.get('/singup', async(req, res) => {
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');

    const { userName, password } = req.query;

    const user = (await addUser(userName, password)) || {};

    res.send(user);
});

app.get('/signin', async(req, res) => {
    const { userName } = req.query;

    const user = (await findUser(userName)) || {};

    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');

    if (user) {
        res.status(200);
        res.send(user);
    } else {
        res.status(404);
        res.send('User not found');
    }
});

app.get('/users', async(req, res) => {
    const { userName } = req.query;
    const users = (await getUsers(userName)) || [];

    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');

    res.send(users);
});

app.get('/messages', async(req, res) => {
    const { from, to } = req.query;

    const messages = await getMessages(from, to);

    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');

    res.send(messages);
});

app.post('/messages/send', async(req, res) => {
    const { from, to } = req.query;
    const { message } = req.body;

    const id = await sendMessage(from, to, message);

    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Origin', '*');

    res.send({ id });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});