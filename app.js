const express = require('express');
const onshape = require("./lib/onshapeAPI");
const app = express();

app.use(express.static('public'));
app.use(express.static('data3D'));

app.get('/', (req, res) => {
    res.send('Hello World Extreme');
});

app.get('/config', (req, res) => {
    onshape.getConfiguration();
    res.send("config");
});

app.get('/docs', (req, res) => {
        onshape.getDocumentation();
        res.send("docs");
});

app.get('/gltf', (req, res) => {
    onshape.gltfTranslation();
    res.send("gltf");
});

app.get('/config2', (req, res) => {
    onshape.getConfiguration2();
    res.send("config");
});

app.get('/status', (req, res) => {
    onshape.getTranslationStatus("5fb792347bdf97159b3e7497");
    res.send("Status");
});

app.get('/external', (req, res) => {
    onshape.getExternalData("7d139508501735b4ddbdc6be", "5fb79235aae6ca14640792df");
    res.send("Status");
});

app.get('/checkstatus', (req, res) => {
    onshape.checkForTranslationStatusOnce("5fb792347bdf97159b3e7497");
    res.send("Status");
});

app.get('/loop', (req, res) => {
    onshape.loopForDoneTranslationStatus2();
    res.send("Status");
});

app.get('/full', (req, res) => {
    onshape.fullTranslation();
    res.send("Status");
});

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '\\public\\view.html');
});


app.listen(5000, () => console.log("Express Running on Port 5000, server_up"));