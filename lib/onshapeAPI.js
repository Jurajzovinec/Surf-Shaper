const fetch = require('node-fetch');
const crypto = require('crypto');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const keys = require('../config/apikey');

const gltfConfiguration = {
    includeExportIds: false,
    formatName: 'GLTF',
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

// Request Creation Function
const buildHeaders = function (method, path, stream, querystring) {
    let headers = {
        'Content-Type': 'application/json',
        'On-Nonce': crypto.randomBytes(25).toString('hex'),
        'Date': (new Date()).toUTCString(),
        'Accept': stream ? 'application/vnd.onshape.v1+octet-stream' : 'application/vnd.onshape.v1+json'
    };
    const queryString = querystring ? querystring : '';
    const hmacString = (`${method}\n${headers['On-Nonce']}\n${headers['Date']}\n${headers['Content-Type']}\n${path}\n${queryString}\n`).toLowerCase();
    let hmac = crypto.createHmac('sha256', keys.secretKey);
    hmac.update(hmacString);
    let signature = hmac.digest('base64');
    const authorization = `On ${keys.accessKey}:HmacSHA256:${signature}`;
    headers['Authorization'] = authorization;
    
    return headers;
};

// Translation Onshape API
const gltfTranslation = function (updatedConfiguration) {
    console.log('...working on gltfTranslation...');
    const url = `/api/partstudios/d/${keys.documentId}/w/${keys.workspaceId}/e/${keys.elementId}/translations`;
    const method = 'POST';
    const absoluteUrl = 'https://cad.onshape.com' + url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
        body: JSON.stringify(gltfConfiguration)
    };
    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(res => res.json())
            .then(res => {
                resolve(res.id);
            })
            .catch(error => reject(`Error: ${error}`));
    });
};

const getTranslationStatus = function (tid) {
    console.log('...getingTranslationStatus...');
    const url = '/api/translations/' + tid;
    const method = 'GET';
    const absoluteUrl = 'https://cad.onshape.com' + url;
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
                    if (res.requestState === 'ACTIVE') {
                        newPromisTobeDone();
                    } else {
                        let resultDict = ({
                            'requestState': res.requestState,
                            'resultExternalDataIds': res.resultExternalDataIds[0],
                            'documentId': res.documentId
                        });
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
    const url = `/api/documents/d/${documentId}/externaldata/${resultExternalDataIds}`;
    const method = 'GET';
    const absoluteUrl = 'https://cad.onshape.com' + url;
    const headers = buildHeaders(method, url, stream = true);
    const bodyToPassInFetch = {
        method: method,
        headers: headers
    };
    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(res => { console.log(res); resolve(res.text()) })
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

// Export to STL file
const stlTranslation = function (updatedConfiguration) {
    console.log('...gettingSTLData...');
    const urlStl = `/api/partstudios/d/${keys.documentId}/w/${keys.workspaceId}/e/${keys.elementId}/stl`;
    const method = 'GET';
    const absoluteUrl = 'https://cad.onshape.com' + urlStl;
    const headers = buildHeaders(method, urlStl, stream = true);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
        redirect: 'manual'
    };
    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(redirectedResponse => redirectingSTLSource(redirectedResponse))
            .then(res => resolve(res.text()))
            .catch((error) => reject(error));
    });
};

const redirectingSTLSource = function (redirectedResponse) {
    console.log('...redirectingSTLsource...');
    const redirectParsedUrl = url.parse(redirectedResponse.headers.get('location'));
    const method = 'GET';
    const headers = buildHeaders(method, redirectParsedUrl.pathname, stream = true, (redirectParsedUrl.query));
    const redirectedBodyToPassInFetch = {
        method: method,
        headers: headers,
        query: querystring.parse(redirectParsedUrl.query)
    };
    return new Promise(async (resolve, reject) => {
        fetch(redirectParsedUrl.href, redirectedBodyToPassInFetch)
            .then((res) => { resolve(res) })
            .catch((error) => reject(error));
    });
};

const configureAndTranslateSTL = function (newConfigurationObject) {
    return new Promise(async (resolve, reject) => {
        getConfiguration()
            .then(recievedConfiguration => changeParameter(recievedConfiguration, newConfigurationObject))
            .then(updatedConfiguration => updateConfiguration(updatedConfiguration))
            .then(configureAndTranslateSTL => stlTranslation(configureAndTranslateSTL))
            .then(stlData => resolve(stlData))
            .catch(error => reject(error));
    });
};

// Configuration Onshape API
const getConfiguration = function () {
    console.log('...gettingConfiguration...');
    const url = `/api/elements/d/${keys.documentId}/w/${keys.workspaceId}/e/${keys.elementId}/configuration`;
    const method = 'GET';
    const absoluteUrl = 'https://cad.onshape.com' + url;
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
                    if (element.message.quantityType === 'LENGTH' || element.message.quantityType === 'ANGLE') {
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
    console.log('...updatingConfiguration...');
    const url = `/api/elements/d/${keys.documentId}/w/${keys.workspaceId}/e/${keys.elementId}/configuration`;
    const method = 'POST';
    const absoluteUrl = 'https://cad.onshape.com' + url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
        body: JSON.stringify(updatedConfiguration)
    };

    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(res =>  resolve(res.json()))
            .catch(error => reject(`Error: ${error}`));
    });
};

// newDimension manipulation 
const changeParameter = function (recievedConfiguration, newConfigurationObject) {
    console.log('...changingParameter...');
    //console.log(newConfigurationObject);
    return new Promise(async (resolve, reject) => {
        newConfigurationObject.forEach((configParam) => {
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

    //const url = '/api/documents/7d139508501735b4ddbdc6be';
    const url = `/api/documents/${keys.documentId}`;
    const method = 'GET';
    const absoluteUrl = 'https://cad.onshape.com' + url;
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


module.exports = { configureAndTranslate, getConfigurationParams, fullTranslation, configureAndTranslateSTL };