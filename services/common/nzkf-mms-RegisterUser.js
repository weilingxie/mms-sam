var aws = require('aws-sdk');
var ddb = new aws.DynamoDB({apiVersion: '2012-10-08'});

exports.handler = async (event, context) => {
    console.log(event);

    let date = new Date();

    const tableName = process.env.TABLE_NAME;
    const region = process.env.REGION;

    aws.config.update({region: region});

    // If the required parameters are present, proceed
    if (event.request.userAttributes.sub) {

        // -- Write data to DDB
        let ddbParams = {
            Item: {
                'userId': {S: event.request.userAttributes.sub},
                'name':{S: event.request.userAttributes.name},
                'email':{S: event.request.userAttributes.email},
                'gender': {S: event.request.userAttributes.gender},
                'birthdate': {S: event.request.userAttributes.birthdate},
                'phoneNumber': {S: event.request.userAttributes.phone_number},
                'emergencyContact':{S: event.request.userAttributes["custom:emergencyContact"]},
                'city':{S: event.request.userAttributes["custom:city"]},
                'createdAt': {S: date.toISOString()},
                'updatedAt': {S: date.toISOString()}
            },
            TableName: tableName
        };

        // Call DynamoDB
        try {
            await ddb.putItem(ddbParams).promise()
            console.log("Success");
        } catch (err) {
            console.log("Error", err);
        }

        console.log("Success: Everything executed correctly");
        context.done(null, event);

    } else {
        // Nothing to do, the user's email ID is unknown
        console.log("Error: Nothing was written to DDB or SQS");
        context.done(null, event);
    }
};