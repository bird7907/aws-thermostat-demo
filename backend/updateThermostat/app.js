// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

// default imports
const AWSXRay = require("aws-xray-sdk-core");
const AWS = AWSXRay.captureAWS(require("aws-sdk"));
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

function isValidRequest(event) {
  let isIdValid =
    event !== null &&
    event.pathParameters !== null &&
    event.pathParameters.id !== null &&
    /^[\w-]+$/.test(event.pathParameters.id);

  let body = event.body;
  let isBodyValid =
    body !== null && body.thermo !== null && body.item !== null;

  return isIdValid && isBodyValid;
}

function getCognitoUsername(event) {
  let authHeader = event.requestContext.authorizer;
  if (authHeader !== null) {
    return authHeader.claims["cognito:username"];
  }
  return null;
}

function updateRecord(username, recordId, eventBody) {
  console.log('updateRecord, username=' + username + ', recordId=' + recordId);
  console.log(eventBody);

  let d = new Date();
  const params = {
    TableName: TABLE_NAME,
    Key: {
      "cognito_username": username,
      id: recordId,
    },
    UpdateExpression: "set thermo = :t, lastupdate_date = :lud",
    ExpressionAttributeValues: {
      ":t": eventBody.thermo,
      ":lud": d.toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  return docClient.update(params);
}

// Lambda Handler
exports.updateThermostatItem = metricScope((metrics) => async (event, context) => {
  metrics.setNamespace("ThermostatApp");
  metrics.putDimensions({ Service: "updateThermostat" });
  metrics.setProperty("RequestId", context.requestId);

  if (!isValidRequest(event)) {
    metrics.putMetric("Error", 1, Unit.Count);
    return response(400, { message: "Error: Invalid request" });
  }

  try {
    let username = getCognitoUsername(event);
    let data = await updateRecord(
      username,
      event.pathParameters.id,
      event.body
    ).promise();
    metrics.putMetric("Success", 1, Unit.Count);
    return response(200, data);
  } catch (err) {
    metrics.putMetric("Error", 1, Unit.Count);
    return response(400, { message: err.message });
  }
});
