require('dotenv').config();

// Configuration file - set following parameters 
// in order to test your model with application

var keys = {
	'baseUrl': 'https://cad.onshape.com',
	'accessKey': process.env.ONSHAPE_ACCES_KEY,
	'secretKey': process.env.ONSHAPE_SECRET_KEY,
	'documentId': '7d139508501735b4ddbdc6be',
	'workspaceId': 'f38fdcfec24ecd8c4d57ca4f',
	'elementId':  '040977ef479ed9114758fb02'
};

module.exports = keys;
