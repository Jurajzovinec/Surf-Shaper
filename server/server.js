const express = require('express');
const onshape = require("./lib/onshapeAPI");
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.static('public'));

app.get('/view', (req, res) => {
    res.sendFile(__dirname + '\\public\\view.html');
});

app.get('/stl', (req, res) => {
    onshape.configureAndTranslateSTL()
        .then(reponse => res.send(reponse));
});

app.get('/configparams', (req, res) => {
    onshape.getConfigurationParams()
        .then(reponse => res.send(reponse));
});

app.get('/retrievemodelstl/:paramstoupdate', (req, res) => {
    let newConfigParameters = JSON.parse(req.params.paramstoupdate);
    onshape.configureAndTranslateSTL(newConfigParameters)
        .then(stlModelData => res.send(stlModelData))
        .catch(error => console.log(error));
});

app.get('/retrievemodel/:paramstoupdate', (req, res) => {
    let newConfigParameters = JSON.parse(req.params.paramstoupdate);
    onshape.configureAndTranslate(newConfigParameters)
        .then(gltfModelData => res.send(gltfModelData))
        .catch(error => console.log(error));
});

app.get('/defaultmodel', (req, res) => {
    onshape.fullTranslation()
        .then(gltfModelData => res.send(gltfModelData))
        .catch(error => { res.send(error); console.log(error); });
});

app.listen(port, () => console.log(`Express server running on ${port}.`));



