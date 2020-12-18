const express = require('express');
const onshape = require("./lib/onshapeAPI");
const cors = require('cors');
const app = express();


app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World Extreme');
});

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '\\public\\view.html');
});

app.get('/stl', (req, res) => {
    onshape.stlTranslation()
        .then(reponse => res.send(reponse));
});

app.get('/configparams', (req, res) => {
    onshape.getConfigurationParams()
        .then(reponse => res.send(reponse));
});

app.get('/updateparameter', (req, res) => {
    onshape.configureAndTranslate("SurfWidth", 500)
        .then(res.send('Hello World Extreme'));
});

app.get('/retrievemodel/:paramstoupdate', (req, res) => {
    let newConfigParameters = JSON.parse(req.params.paramstoupdate);
    onshape.configureAndTranslate(newConfigParameters)
        .then(gltfModelData => res.send(gltfModelData))
        .catch(error => console.log(error));
});

app.get('/retrievemodelstl/:paramstoupdate', (req, res) => {
    let newConfigParameters = JSON.parse(req.params.paramstoupdate);
    onshape.configureAndTranslateSTL(newConfigParameters)
        .then(gltfModelData => res.send(gltfModelData))
        .catch(error => console.log(error));
});

app.get('/defaultmodel', (req, res) => {
    onshape.fullTranslation()
        .then(gltfModelData => res.send(gltfModelData))
        .catch(error => { res.send(error); console.log(error); });
});

app.listen(5000, () => console.log("Express Running on Port 5000, server"));



