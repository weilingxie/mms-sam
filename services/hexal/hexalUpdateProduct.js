'use strict';
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    
    let responseBody = "";
    let statusCode = 0;

    const params = {
        TableName: "Products",
        Key: {
            id: '12345'
        },
        UpdateExpression: "set productname = :n",
        ExpressionAttributeValues: {
            ":n":"Water Pumps"
        },
        ReturnValues: "UPDATED_NEW"
    }

    try {
        const data = await documentClient.update(params).promise();
        responseBody = JSON.stringify(data);
        statusCode = 204;
    } catch(err){
        responseBody = `Unable to update product : ${err}`;
        statusCode = 403;
    }

    const response = {
        statusCode,
        headers: {
            "Content-Type":"application/json"
        },
        body: responseBody
    };

    return response;
};