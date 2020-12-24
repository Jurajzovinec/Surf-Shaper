const express = require('express');
const onshape = require("./lib/onshapeAPI");
const cors = require('cors');
const path = require('path');
const serveStatic = require('serve-static');
const app = express();
const port = process.env.PORT || 5000;

if(process.env.NODE_ENV === 'production') {
    app.use(cors());
} else {
    app.use(cors({ origin: "http://localhost:3000" }));
}

app.get('/configparams', (req, res) => {
    onshape.getConfigurationParams()
        .then(reponse => res.send(reponse));
});

app.use(serveStatic(__dirname+'/client/dist'));

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

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(port, () => console.log(`Express server running on ${port}.`));



