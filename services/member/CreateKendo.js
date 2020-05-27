'use strict';
const AWS = require('aws-sdk');
const uuid = require('uuid');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    let responseBody = "";
    let statusCode = 0;
    let kendoId = uuid.v4();

    const { memberId, grade, shimpanLevel, coachLevel, dojo  } = JSON.parse(event.body);
    /*let memberId = "94c51667-de6c-4adc-b26d-88247f3a8d9d";
    let grade = "1";
    let shimpanLevel = "1";
    let coachLevel = "1";
    let dojo = {
        dojoName:"AKC"
    };*/

    const params = {
        TransactItems: [
            {
                Update: {
                    TableName: "mms-users",
                    Key: {
                        userId: memberId
                    },
                    UpdateExpression: "set kendo = :n",
                    ExpressionAttributeValues: {
                        ":n":kendoId
                    },
                    ReturnValues: "UPDATED_NEW"
                }
            },
            {
                Put: {
                    TableName: "mms-kendo-profiles",
                    Item: {
                        id: kendoId,
                        grade: grade,
                        shimpanLevel: shimpanLevel,
                        coachLevel: coachLevel,
                        dojo: dojo,
                        memberId: memberId
                    }
                }
            }
        ]
    };

    try {
        const data = await documentClient.transactWrite(params).promise();

        responseBody = JSON.stringify(data);
        statusCode = 204;
    } catch(err){
        responseBody = `Unable to create kendo : ${err}`;
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