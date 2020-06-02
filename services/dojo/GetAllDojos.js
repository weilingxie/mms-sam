'use strict';
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {    
    
    let responseBody = "";
    let statusCode = 0;

    const params = {
        TableName: "Dojos"
    }

    try {
        const data = await documentClient.scan(params).promise();
        responseBody = JSON.stringify(data.Items);
        statusCode = 200;
    } catch(err){
        responseBody = `Unable to get products: ${err}`;
        statusCode = 403;
    }

    const response = {
        statusCode,
        headers: {
            "Content-Type":"application/json",
            "Access-Control-Allow-Origin" : "*"
        },
        body: responseBody
    };

    return response;
};