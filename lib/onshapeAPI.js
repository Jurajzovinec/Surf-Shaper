const fetch = require('node-fetch');
const crypto = require('crypto');
const fs = require('fs');

const keys = {
	'baseUrl': 'https://cad.onshape.com',
	'accessKey': "DrrjPHGexLoZDJ2dqIZlijp6",
	'secretKey': "82FcdI3UIncvyVUScQEYAfpZgiZHUaKaPiAJgesEy0DPOSIS",
	'documentId': "7d139508501735b4ddbdc6be",
	'workspaceId': "f38fdcfec24ecd8c4d57ca4f",
	'elementId':  "040977ef479ed9114758fb02"
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
    resolution: 'medium',
    distanceTolerance: 0.00012,
    angularTolerance: 0.1090830782496456,
    maximumChordLength: 10
};

const buildHeaders = function(method, url, stream){
    let headers = {
        'Content-Type': 'application/json',
        'On-Nonce': crypto.randomBytes(25).toString('hex'),
        'Date': (new Date()).toUTCString(),
        //'Accept':'application/vnd.onshape.v1+json',
        'Accept': stream ? 'application/vnd.onshape.v1+octet-stream' : 'application/vnd.onshape.v1+json'
    };
    //console.log(headers.Accept);
    const queryString = '';
    let hmacString = (method + '\n' + headers['On-Nonce'] + '\n' + headers['Date'] + '\n' + headers['Content-Type'] + '\n' + url + '\n' + queryString + '\n').toLowerCase();
    let hmac = crypto.createHmac('sha256', keys.secretKey);
    hmac.update(hmacString);
    let signature = hmac.digest('base64');
    const authorization = 'On ' + keys.accessKey + ':HmacSHA256:' + signature;
    headers['Authorization']=authorization;
    //console.log(`Headers looks like this.`);
    //console.log(headers);
    return(headers);
};

const gltfTranslation = function() {
    const url = "/api/partstudios/d/7d139508501735b4ddbdc6be/w/f38fdcfec24ecd8c4d57ca4f/e/040977ef479ed9114758fb02/translations";
    const method = 'POST';
    const absoluteUrl = "https://cad.onshape.com"+ url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    };
    return new Promise(async (resolve, reject) => {
    fetch(absoluteUrl, bodyToPassInFetch)
        .then(res =>res.json())
        .then(res =>{
            console.log(`Id of the Translation from gltfTranslation is ${res.id}`);
            resolve(res.id);})
        .catch(error => reject(`Error: ${error}`));
    });
};

const getTranslationStatus = function(tid) {
    console.log('Here is confirmed that tid is the same '+tid);
    const url = "/api/translations/"+tid;
    const method = 'GET';
    const absoluteUrl = "https://cad.onshape.com"+ url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
    };  
    return new Promise(async (resolve, reject) => { 
        function newPromisTobeDone() {
                fetch(absoluteUrl, bodyToPassInFetch)
                    .then(res => res.json())
                    .then(res=>{ 
                        console.log(res);
                        if (res.requestState==='ACTIVE'){
                            newPromisTobeDone();
                        } else {
                            let resultDict = ({
                                'requestState':res.requestState,
                                'resultExternalDataIds': res.resultExternalDataIds[0],
                                'documentId':res.documentId
                            });
                            console.log(resultDict);
                            resolve (resultDict);
                        }
                    })
                    .catch(error => reject(`Error: ${error}`));
        }
        newPromisTobeDone();
    });      
};

const getExternalData = function(documentId, resultExternalDataIds) {
    console.log('External data Function');
    const url = "/api/documents/d/"+documentId+"/externaldata/"+resultExternalDataIds;
    console.log(url);
    const method = 'GET';
    const absoluteUrl = "https://cad.onshape.com"+ url;
    const headers = buildHeaders(method, url, stream=true);
    const bodyToPassInFetch = {
        method: method,
        headers: headers
    };
    fs.writeFile('brand_new_file.txt', "",()=>console.log('File Cleared!'));
    return new Promise(async (resolve, reject) => {
        fetch(absoluteUrl, bodyToPassInFetch)
            .then(res=> res.text())
            .then(res=> fs.appendFile('public/surf.gltf', res, ()=>resolve('Chunk Saved!')))
            .catch(error => reject(`Error: ${error}`));
    });
};

const checkForTranslationStatusOnce = function(tid){
    getTranslationStatus(tid)
    .then(res => {return res;});
};

const fullTranslation = async function(){
    gltfTranslation()
    .then(tid=>getTranslationStatus(tid))
    .then(resDict=>getExternalData(resDict.documentId, resDict.resultExternalDataIds))
    .catch(err=>console.log(err));
};

const getDocumentation = function() {

    const url = "/api/documents/7d139508501735b4ddbdc6be";
    const method = 'GET';
    const absoluteUrl = "https://cad.onshape.com"+ url;
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

const getConfiguration = function() {

    const url = "/api/elements/d/7d139508501735b4ddbdc6be/w/f38fdcfec24ecd8c4d57ca4f/e/040977ef479ed9114758fb02/configuration";
    const method = 'GET';
    const absoluteUrl = "https://cad.onshape.com"+ url;
    const headers = buildHeaders(method, url);
    const bodyToPassInFetch = {
        method: method,
        headers: headers,
    };
    return fetch(absoluteUrl, bodyToPassInFetch)
        .then(res =>{
            console.log(res);
            return res.json();
        })
        .then(res => console.log(res))
        .catch(error => console.log(`Error: ${error}`));
};

module.exports = {gltfTranslation,  getDocumentation, 
    getConfiguration, getTranslationStatus, getExternalData, 
    checkForTranslationStatusOnce, fullTranslation};