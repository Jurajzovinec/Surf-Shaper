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

app.get('/configparams', (req, res) => {
    onshape.getConfigurationParams()
    .then(reponse=>res.send(reponse));
});

app.get('/updateParameter', (req, res) => {
    onshape.configureAndTranslate("SurfWidth", 500)
        .then(res.send('Hello World Extreme'));
});

app.listen(5000, () => console.log("Express Running on Port 5000, server"));



