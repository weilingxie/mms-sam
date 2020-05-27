'use strict';
const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    
    
    let responseBody = "";
    let statusCode = 0;

    let { kendoId } = event.pathParameters;

    const params = {
        TableName: "mms-kendo-profiles",
        Key:{
            id: kendoId
        }
    }

    try {
        const data = await documentClient.get(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 200;
    } catch(err){
        responseBody = `Unable to get kendo id>>${kendoId}: ${err}`;
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