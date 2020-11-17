var util = require('./util.js');
var errors = require('../config/errors.js');
var crypto = require('crypto');
var url = require('url');
var querystring = require('querystring');
const fs = require('fs');

class Client {
    constructor(){
        try {
            this.apikey = require('../config/apikey.js');
        } catch (e) {
            util.error(errors.credentialsFileError);
        }
        this.protocol = null;
        // basic error checking on creds
        if (typeof this.apikey.baseUrl !== 'string' ||
          typeof this.apikey.accessKey !== 'string' ||
          typeof this.apikey.secretKey !== 'string') {
          util.error(errors.credentialsFormatError);
        }
        if (this.apikey.baseUrl.indexOf('http://') === 0) {
          this.protocol = require('http');
        } else if (this.apikey.baseUrl.indexOf('https://') === 0) {
          this.protocol = require('https');
        } else {
          util.error(errors.badBaseUrlError);
        }  
    }
    buildNonce(){
        var nonce = crypto.randomBytes(25).toString('hex');
        console.log(`Generated string is ${nonce}`);
        return nonce;
    }
    buildHeaders(method, path, queryString, inputHeaders){
        
        let headers = util.copyObject(inputHeaders);
        let authDate = (new Date()).toUTCString();
        let onNonce = this.buildNonce();

        if (!('Content-Type' in headers)) {
          headers['Content-Type'] = 'application/json';
        }
        let hmacString = (method + '\n' + onNonce + '\n' + authDate + '\n' +
          headers['Content-Type'] + '\n' + path + '\n' + queryString + '\n').toLowerCase();
        let hmac = crypto.createHmac('sha256', this.apikey.secretKey);
        hmac.update(hmacString);
        let signature = hmac.digest('base64');
        let asign = 'On ' + this.apikey.accessKey + ':HmacSHA256:' + signature;
        headers['On-Nonce'] = onNonce;
        headers['Date'] = authDate;
        headers['Authorization'] = asign;
        if (!('Accept' in headers)) {
          headers['Accept'] = 'application/vnd.onshape.v1+json';
        }
        return headers;
    }
    buildDWMVEPath(opts){
        let path = '/api/' + opts.resource + '/d/' + opts.d;
        if ('w' in opts) {
          path += '/w/' + opts.w;
        } else if ('v' in opts) {
          path += '/v/' + opts.v;
        } else if ('m' in opts) {
          path += '/m/' + opts.m;
        }
        if ('e' in opts) {
          path += '/e/' + opts.e;
        }
        if ('subresource' in opts) {
          path += '/' + opts.subresource;
        }
        console.log(`Path is ${path}`);
        return path;
    }
    buildQueryString(opts) {
        if (!('query' in opts) || typeof opts.query !== 'object' || opts.query == null) {
          return '';
        }
        return querystring.stringify(opts.query);
    }
    inputHeadersFromOpts(opts){
        return (!('headers' in opts) || typeof opts.headers !== 'object' || opts.headers == null) ?
          {} : util.copyObject(opts.headers);
    }
    buildRequest(opts){
        var path = '';
        if ('path' in opts) {
            path = opts.path;
        } else {
            path = this.buildDWMVEPath(opts);
        }
        var baseUrl = ('baseUrl' in opts) ? opts.baseUrl : this.apikey.baseUrl;
        var queryString = this.buildQueryString(opts);
        var inputHeaders = this.inputHeadersFromOpts(opts);
        var headers = this.buildHeaders('GET', path, queryString, inputHeaders);
        if (queryString !== '') queryString = '?' + queryString;
        var requestOpts = url.parse(baseUrl + path + queryString);
        requestOpts.method = 'GET';
        requestOpts.headers = headers;
        // console.log(`Get function - onshape.js, request options: ${JSON.stringify(requestOpts)}`);
        return requestOpts;
    }
    get(opts, cb) {
            const requestOpts = this.buildRequest(opts);
            const req = this.protocol.request(requestOpts,  (res) => {
                let wholeData = '';
                res.on('data', (data) => wholeData += data);
                res.on('end', () => {
                if (res.statusCode === 200) {
                    cb(wholeData);
                } else if (res.statusCode === 307) {
                    const redirectParsedUrl = url.parse(res.headers.location);
                    console.log('Redirecting to ' + res.headers.location);
                    // the redirect contains a query string, which the API key mechanism needs to encrypt
                    const redirectOpts = {
                    baseUrl: redirectParsedUrl.protocol + '//' + redirectParsedUrl.host,
                    path: redirectParsedUrl.pathname,
                    headers: opts.inputHeaders,
                    query: querystring.parse(redirectParsedUrl.query)
                    };
                    this.get(redirectOpts, cb);
                } else {
                    //console.log(requestOpts.method + ' ' + baseUrl + path + queryString);
                    console.log('Status: ' + res.statusCode);
                    if (wholeData) {
                    console.log(wholeData.toString());
                    }
                    util.error(errors.notOKError);
                    console.log('Acces has been rejected. Resolve code:', res.statusCode);
                }
                });
            }).on('error', function (e) {
                console.log(requestOpts.method + ' ' + baseUrl + path + queryString);
                console.log(e);
                util.error(errors.getError);
                reject('Error - acces has been rejected.');
            });
            req.end();
    }
    post(opts, cb){
      let path = '';
      if ('path' in opts) {
        path = opts.path;
      } else {
        path = this.buildDWMVEPath(opts);
      }
      
      var baseUrl = ('baseUrl' in opts) ? opts.baseUrl : this.apikey.baseUrl;
      var headers = this.buildHeaders('POST', path, '', this.inputHeadersFromOpts(opts));
      var requestOpts = url.parse(baseUrl + path);
      requestOpts.method = 'POST';
      requestOpts.headers = headers;

      console.log('--------------------opts-----------------');
      console.log(opts);
      console.log('--------------------request-----------------');
      console.log(requestOpts);
      console.log('--------------------request-----------------')

      var req = this.protocol.request(requestOpts, function (res) {
        var wholeData = '';
        res.on('data', function (data) {
          wholeData += data;
        });
        res.on('end', function () {
          if (res.statusCode === 200) {
            console.log('POST PARSED !!!!!!');
            cb(wholeData);
          } else {
            console.log(requestOpts.method + ' ' + baseUrl + path);
            console.log(req.body);
            console.log('Status: ' + res.statusCode);
            if (wholeData) {
              console.log(wholeData.toString());
            }
            util.error(errors.notOKError);
          }
        });
      }).on('error', function (e) {
        console.log(requestOpts.method + ' ' + baseUrl + path);
        console.log(e);
        util.error(errors.postError);
      });
      if ('body' in opts) {
        req.write(JSON.stringify(opts.body));
      } else {
        req.write('{}');
      }
      req.end();
    }
    updateConfiguration(cb){
      let jsonFile = fs.readFileSync("data3D/surfboard_config.json", "utf8");
      jsonFile = JSON.parse(jsonFile);
      var opts = {
        d: this.apikey.documentId,
        w: this.apikey.workspaceId,
        e: this.apikey.elementId,
        resource: 'elements',
        subresource: 'configuration',
        body: jsonFile
      };
      this.post(opts, cb);
    }
    getConfiguration(cb){
        var opts = {
          d: this.apikey.documentId,
          w: this.apikey.workspaceId,
          e: this.apikey.elementId,
          resource: 'elements',
          subresource: 'configuration',
        };
        this.get(opts, cb);      
    }
    exportStl(cb){
        const opts = {
          d: this.apikey.documentId,
          w: this.apikey.workspaceId,
          e: this.apikey.elementId,
          queryObject: { mode: "string" },
          resource: 'partstudios',
          subresource: 'stl',
          headers: {
            'Accept': 'application/vnd.onshape.v1+octet-stream'
          }
        };
        this.get(opts, cb);
    }
    exportGltf(cb){
      let jsonFile = fs.readFileSync("data3D/surfboard_config.json", "utf8");
      jsonFile = JSON.parse(jsonFile);
      const opts = {
        d: this.apikey.documentId,
        w: this.apikey.workspaceId,
        //e: this.apikey.elementId,
        resolution: 'medium',
        distanceTolerance: 0.00012,
        angularTolerance: 0.1090830782496456,
        maximumChordLength: 10,
        body: {
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
          fromUserId: null
      }
      };
      this.get(opts, cb);
    }
    getDocs(cb){
      
    }
} 

module.exports = { Client };