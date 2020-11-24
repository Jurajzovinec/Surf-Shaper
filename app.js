const express = require('express');
const onshape = require("./lib/onshapeAPI");
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World Extreme');
});

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '\\public\\view.html');
});

app.get('/updateParameter', (req, res) => {
    onshape.configureAndTranslate("SurfWidth", 500)
    .then(res.send('Hello World Extreme'));
});

app.listen(5000, () => console.log("Express Running on Port 5000, server_up"));



