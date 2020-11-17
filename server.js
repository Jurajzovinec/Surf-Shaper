const express = require('express');
const app = express();
var path = require('path');
const cors = require("cors"); // cross-origin resource sharing
const onshapeAPI = require("./lib/onshapeAPI");
const apiCommands = new onshapeAPI.Client();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World Extreme');
});

app.get('/config', (req, res) => {
    apiCommands.getConfiguration((data) => {
        console.log(data.toString());
        res.send(data);
    });
});

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '\\public\\view.html');
});

app.get('/stl', (req, res) => {
    apiCommands.exportStl((data) => {
        //console.log(data.toString());
        res.send(data);
    });
});

app.get('/gltf', (req, res) => {
    apiCommands.exportGltf((data) => {
        //console.log(data.toString());
        res.send(data);
    });
});

app.get('/updateConf', (req, res) => {
    apiCommands.updateConfiguration((data) => {
        //console.log(data.toString());
        res.send(data);
    });
});




app.listen(8000, () => console.log("Express Running on Port 8000, server_up"));