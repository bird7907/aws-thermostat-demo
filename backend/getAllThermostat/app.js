// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// default imports
// const AWSXRay = require("aws-xray-sdk-core");
// const AWS = AWSXRay.captureAWS(require("aws-sdk"));
const AWS =require("aws-sdk");
const { metricScope, Unit } = require("aws-embedded-metrics");
const DDB = new AWS.DynamoDB({ apiVersion: "2012-10-08" });

// environment variables
const { TABLE_NAME, ENDPOINT_OVERRIDE, REGION } = process.env;
const options = { region: REGION };
AWS.config.update({ region: REGION });

if (ENDPOINT_OVERRIDE !== "") {
  options.endpoint = ENDPOINT_OVERRIDE;
}

const docClient = new AWS.DynamoDB.DocumentClient(options);
// response helper
const response = (statusCode, body, additionalHeaders) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    ...additionalHeaders,
  },
});

// Get cognito username from claims
function getCognitoUsername(event) {
  let authHeader = event.requestContext.authorizer;
  if (authHeader !== null) {
    return authHeader.claims["cognito:username"];
  }
  return null;
}

// Retrieve all the items by cognitoUsername
function getRecords(username) {
  console.log('getRecords, username='+username);

  let params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "#username = :username",
    ExpressionAttributeNames: {
      "#username": "cognitoUsername",
    },
    ExpressionAttributeValues: {
      ":username": username,
    },
  };

  return docClient.query(params);
}

// Lambda Handler
exports.getAllThermostatItem = metricScope((metrics) => async (event, context) => {
  metrics.setNamespace("ThermostatApp");
  metrics.putDimensions({ Service: "getAllThermostat" });
  metrics.setProperty("RequestId", context.requestId);

  
  try {
    let username = getCognitoUsername(event);
    let data = await getRecords(username).promise();

    console.log('getAllThermostatItem, data:', data);

    metrics.putMetric("Success", 1, Unit.Count);
    return response(200, data);
  } catch (err) {
    metrics.putMetric("Error", 1, Unit.Count);
    console.error(err.message);
    return response(400, { message: err.message });
  }
});
