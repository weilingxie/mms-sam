'use strict';
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    
    let responseBody = "";
    let statusCode = 0;

    let { id } = event.pathParameters;

    const params = {
        TableName: "Dojos",
        Key:{
            id: id
        }
    }

    try {
        const data = await documentClient.get(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 200;
    } catch(err){
        responseBody = `Unable to get dojo id>>${id}: ${err}`;
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