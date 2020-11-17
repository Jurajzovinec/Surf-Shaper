require("dotenv").config();

var prod = {
	'baseUrl': 'https://cad.onshape.com',
	'accessKey': process.env.ONSHAPE_ACCES_KEY,
	'secretKey': process.env.ONSHAPE_SECRET_KEY,
	'documentId': "7d139508501735b4ddbdc6be",
	'workspaceId': "f38fdcfec24ecd8c4d57ca4f",
	'elementId':  "040977ef479ed9114758fb02"
};

module.exports = prod;


// The API key's access key is DrrjPHGexLoZDJ2dqIZlijp6 and the secret key is 
// 82FcdI3UIncvyVUScQEYAfpZgiZHUaKaPiAJgesEy0DPOSIS 
// Please transfer this securely to your application now as you will not be able to display this secret key string again. 