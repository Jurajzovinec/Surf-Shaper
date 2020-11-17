const fs = require('fs');
var onshapeClient = require('./client.js');


let jsonFile = fs.readFileSync("lib/surfboard_config.json", "utf8");
jsonFile = JSON.parse(jsonFile);

jsonFile.configurationParameters.forEach(element => {
    if(element.message.parameterName === "SurfWidth"){
        element.message.defaultValue = 600;
        //console.log(element.message);
    }
});

jsonFile.configurationParameters.forEach(element => {
    if(element.message.parameterName === "SurfLength"){
        element.message.defaultValue = 1621;
        //console.log(element.message);
    }
});
// console.log(jsonFile.configurationParameters);


console.log(jsonFile);
const session = new onshapeClient.Client();
session.updateConfiguration();

class Surfboard {
    constructor(){
        console.log('Surfboard Configuration has been initilized.');
        console.log(jsonFile.configurationParameters);
    }
}
