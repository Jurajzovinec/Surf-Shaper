const fetch = require('node-fetch');
const crypto = require('crypto');
const fs = require('fs');

const keys = {
    'baseUrl': 'https://cad.onshape.com',
    'accessKey': "DrrjPHGexLoZDJ2dqIZlijp6",
    'secretKey': "82FcdI3UIncvyVUScQEYAfpZgiZHUaKaPiAJgesEy0DPOSIS",
    'documentId': "7d139508501735b4ddbdc6be",
    'workspaceId': "f38fdcfec24ecd8c4d57ca4f",
    'elementId': "040977ef479ed9114758fb02"
};

const body = {
    includeExportIds: false,
    formatName: "GLTF",
    flattenAssemblies: false,
    yAxisIsUp: false,
    triggerAutoDownload: false,
    storeInDocument: false,
    connectionId: '',
    versionString: '',
    grouping: true,
    destinationName: '',
    configuration: 'default',
    cloudStorageAccountId: null,
    emailLink: false,
    emailTo: null,
    emailSubject: null,
    emailMessage: null,
    sendCopyToMe: null,
    passwordRequired: null,
    password: null,
    validForDays: null,
    fromUserId: null,
    linkDocumentWorkspaceId: keys.workspaceId,
    resolution: 'high',
    distanceTolerance: 0.00012,
    angularTolerance: 0.1090830782496456,
    maximumChordLength: 10
};

// Request Creation Functions
const buildHeaders = function (method, url, stream) {
    let headers = {
        'Content-Type': 'application/json',
        'On-Nonce': crypto.randomBytes(25).toString('hex'),
        'Date': (new Date()).toUTCString(),
        'Accept': stream ? 'application/vnd.onshape.v1+octet-stream' : 'application/vnd.onshape.v1+json'
    };
    const queryString = '';
    let hmacString = (method + '\n' + headers['On-Nonce'] + '\n' + headers['Date'] + '\n' + headers['Content-Type'] + '\n' + url + '\n' + queryString + '\n').toLowerCase();
    let hmac = crypto.createHmac('sha256', keys.secretKey);
    hmac.update(hmacString);
    let signature = hmac.digest('base64');
    const authorization = 'On ' + keys.accessKey + ':HmacSHA256:' + signature;
    headers['Authorization'] = authorization;
    return (headers);
};

// Translation Onshape API
const gltfTranslation = function (updatedConfiguration) {
    console.log("...working on gltfTranslation...");
    //console.log(updatedConfiguration);
    const url = "/api/partstudios/d/7d139508501735b4ddbdc6be/w/f38fdcfec24ecd8c4d57ca4f/e/040977ef479ed9114758fb02/translations";
    const method = 'POST';
    const absoluteUrl = "https://cad.onshape.com" + url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    };
    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(res => res.json())
            .then(res => {
                //console.log(`Id of the Translation from gltfTranslation is ${res.id}.....gltfTranslation`);
                resolve(res.id);
            })
            .catch(error => reject(`Error: ${error}`));
    });
};

const getTranslationStatus = function (tid) {
    //console.log('Here is confirmed that tid is the same '+tid);
    console.log("...getingTranslationStatus...");
    const url = "/api/translations/" + tid;
    const method = 'GET';
    const absoluteUrl = "https://cad.onshape.com" + url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
    };
    return new Promise(async (resolve, reject) => {
        function newPromisTobeDone() {
            fetch(absoluteUrl, bodyToPassInFetch)
                .then(res => res.json())
                .then(res => {
                    //console.log(res);
                    if (res.requestState === 'ACTIVE') {
                        newPromisTobeDone();
                    } else {
                        let resultDict = ({
                            'requestState': res.requestState,
                            'resultExternalDataIds': res.resultExternalDataIds[0],
                            'documentId': res.documentId
                        });
                        //console.log(resultDict);
                        resolve(resultDict);
                    }
                })
                .catch(error => reject(`Error: ${error}`));
        }
        newPromisTobeDone();
    });
};

const getExternalData = function (documentId, resultExternalDataIds) {
    console.log('...getingExternalData...');
    const url = "/api/documents/d/" + documentId + "/externaldata/" + resultExternalDataIds;
    //console.log(url);
    const method = 'GET';
    const absoluteUrl = "https://cad.onshape.com" + url;
    const headers = buildHeaders(method, url, stream = true);
    const bodyToPassInFetch = {
        method: method,
        headers: headers
    };
    fs.writeFile('public/surf.gltf', "", () => console.log('File Cleared!'));
    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(res => resolve(res.text()))
            .catch(error => reject(`Error: ${error}`));
    });
};

const fullTranslation = function () {
    return new Promise(async (resolve, reject) => {
        gltfTranslation()
            .then(tid => getTranslationStatus(tid))
            .then(resDict => getExternalData(resDict.documentId, resDict.resultExternalDataIds))
            .then(chunkSavedMssg => resolve(chunkSavedMssg))
            .catch(err => reject(err));
    });
};

// Configuration Onshape API
const getConfiguration = function () {
    console.log("...gettingConfiguration...");
    const url = "/api/elements/d/7d139508501735b4ddbdc6be/w/f38fdcfec24ecd8c4d57ca4f/e/040977ef479ed9114758fb02/configuration";
    const method = 'GET';
    const absoluteUrl = "https://cad.onshape.com" + url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
    };
    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(res => resolve(res.json()))
            .catch(error => reject(`Error: ${error}`));
    });
};

const getConfigurationParams = function () {
    let returnState = [];
    return new Promise(async (resolve, reject) => {
        getConfiguration()
            .then(recievedConfiguration => {
                recievedConfiguration.configurationParameters.map(element => {
                    if (element.message.quantityType === "LENGTH" || element.message.quantityType === "ANGLE") {
                        returnState.push({
                            name: element.message.parameterName,
                            minValue: element.message.rangeAndDefault.message.minValue,
                            maxValue: element.message.rangeAndDefault.message.maxValue,
                            defValue: element.message.rangeAndDefault.message.defaultValue
                        });
                    }
                }
                );
                console.log(returnState);
                resolve(returnState);
            });
    });
};

const updateConfiguration = function (updatedConfiguration) {
    console.log("...updatingConfiguration...");
    const url = "/api/elements/d/7d139508501735b4ddbdc6be/w/f38fdcfec24ecd8c4d57ca4f/e/040977ef479ed9114758fb02/configuration";
    const method = 'POST';
    const absoluteUrl = "https://cad.onshape.com" + url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
        body: JSON.stringify(updatedConfiguration)
    };

    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(res => resolve(res.json()))
            .catch(error => reject(`Error: ${error}`));
    });
};

// newDimension manipulation 
const changeParameter = function (recievedConfiguration, newConfigurationObject) {
    console.log("...changingParameter...");
    //console.log(newConfigurationObject);
    return new Promise(async (resolve, reject) => {
        newConfigurationObject.forEach((configParam)=>{
            recievedConfiguration.configurationParameters.forEach(element => {
                if (element.message.parameterName === configParam.name) {
                    if (configParam.defValue < element.message.rangeAndDefault.message.minValue) {
                        element.message.rangeAndDefault.message.defaultValue = element.message.rangeAndDefault.message.minValue;
                    } else if (configParam.defValue > element.message.rangeAndDefault.message.maxValue) {
                        element.message.rangeAndDefault.message.defaultValue = element.message.rangeAndDefault.message.maxValue;
                    } else {
                        element.message.rangeAndDefault.message.defaultValue = configParam.defValue;
                    }
                }
            });
        });
        resolve(recievedConfiguration);
    });
};

const configureAndTranslate = function (newConfigurationObject) {
    return new Promise(async (resolve, reject) => {
        getConfiguration()
            .then(recievedConfiguration => changeParameter(recievedConfiguration, newConfigurationObject))
            .then(updatedConfiguration => updateConfiguration(updatedConfiguration))
            .then(updatedConfiguration => gltfTranslation(updatedConfiguration))
            .then(tid => getTranslationStatus(tid))
            .then(resDict => getExternalData(resDict.documentId, resDict.resultExternalDataIds))
            .then(chunkSavedMssg => resolve(chunkSavedMssg))
            .catch(error => reject(error));
    });
};

// Documentation API
const getDocumentation = function () {

    const url = "/api/documents/7d139508501735b4ddbdc6be";
    const method = 'GET';
    const absoluteUrl = "https://cad.onshape.com" + url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
    };
    return fetch(absoluteUrl, bodyToPassInFetch)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(error => console.log(`Error: ${error}`));
};


module.exports = { configureAndTranslate, getConfigurationParams, fullTranslation };