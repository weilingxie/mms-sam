'use strict';
const AWS = require('aws-sdk');
const uuid = require('uuid');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    
    console.log(event);
    let responseBody = "";
    let statusCode = 0;
    let dojoId = uuid.v4();
    const { dojoName, dojoVenueAddress, dojoContactNumber, dojoMailingAddress, dojoFounder, dojoEstablishmentDate, 
            chiefInstructor, martialArts, instructors, city, region, dojoStatus  } = JSON.parse(event.body);

    const params = {
        TableName: "Dojos",
        Item: {
            id: dojoId,
            dojoName: dojoName,
            dojoVenueAddress: dojoVenueAddress,
            dojoContactNumber: dojoContactNumber,
            dojoMailingAddress: dojoMailingAddress,
            dojoFounder: dojoFounder,
            dojoEstablishmentDate: dojoEstablishmentDate,
            dojoStatus:dojoStatus,
            chiefInstructor: chiefInstructor,
            martialArts: martialArts,
            instructors: instructors,            
            city: city,
            region: region
        }
    }

    try {
        const data = await documentClient.put(params).promise();
        responseBody = JSON.stringify({ dojoId:dojoId });
        statusCode = 201;
    } catch(err){
        responseBody = `Unable to create product : ${err}`;
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