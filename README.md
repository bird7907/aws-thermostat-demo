# aws-thermostat-demo
A thermostat demo built on AWS

## Architeture
![Reference Architecture - Web Application](https://raw.githubusercontent.com/GQMai/aws-thermostat-demo/master/img/architecture.png)


## Prerequisites
* AWS account
* Install & set up SAM tool: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html

## Running the Example

Fork this repository to your own GitHub account, as you will need to create a Personal Access Token in Github for the Amplify console, as well as provide your GitHub repository URL in the deployment.

You can use the provided [AWS SAM template](./template.yml) to launch a stack that shown here on this Serverless reference architecture. Details about the resources created by this template are provided in the *SAM Template Resources* section of this document.

## Generating your Github Access Token

In order for use the Amplify Console, you need to generate a personal access token.
Once created, an access token should be stored in a safe place, as it may not be available to be seen the next time and may need to regenerate a new one again.
In order to setup your access token, go to [New personal access page](https://github.com/settings/tokens/new) in GitHub.

Note that you might need to enter your password in order to proceed.

### Using SAM and the Amplify Console to Build and Deploy the Full Stack Application
Configure globals.
```bash
export AWS_DEFAULT_REGION=<your preferred region, i.e. us-east-1>
export STACK_NAME=<a unique name for your CloudFormation stack>
```

### Building the Application Step by Step

#### Build the backend functions

The AWS SAM CLI comes with abstractions for a number of Lambda runtimes to build your dependencies, and copies the source code into staging folders so that everything is ready to be packaged and deployed. The `sam build` command builds any dependencies that your application has, and copies your application source code to folders under aws-sam/build to be zipped and uploaded to Lambda.

```bash
sam build --use-container
```

## Deploy
```cmd
sam deploy --stack-name $STACK_NAME
```
Or deploy with guidance
```cmd
sam deploy --guided --stack-name $STACK_NAME
```


## Local test


To run the dynamodb table locally

```bash
docker run -p 8000:8000 amazon/dynamodb-local
```

Create local dynamodb table
```bash
aws dynamodb create-table --table-name thermostat-table --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://127.0.0.1:8000
aws dynamodb create-table --table-name log-table --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://127.0.0.1:8000
```

List local dynamodb tables
```bash
aws dynamodb list-tables --endpoint-url http://127.0.0.1:8000
```


Delete local dynamodb table
```bash
aws dynamodb delete-table --table-name thermostat-table  --endpoint-url http://127.0.0.1:8000
```

Write item
```bash
aws dynamodb put-item  --table-name thermostat-table  --item '{\"cognito_username\": {\"S\": \"Test User\"},\"id\":{\"S\":\"57f34e00-2751-11ec-826e-a5bc87271450\"}}' --endpoint-url http://127.0.0.1:8000
```

Get item
```bash
aws dynamodb get-item --table-name thermostat-table --key '{\"id\":{\"S\":\"57f34e00-2751-11ec-826e-a5bc87271450\"}}' --endpoint-url http://127.0.0.1:8000
```

Query item
```bash
aws dynamodb query --table-name thermostat-table --key-condition-expression "id = :id"  --expression-attribute-values  '{\":id\":{\"S\":\"57f34e00-2751-11ec-826e-a5bc87271450\"}}' --endpoint-url http://127.0.0.1:8000
```

Generate events
```bash
sam local generate-event apigateway aws-proxy --method GET --resource thermostat --path thermostats > event.json
```

Test 
Get all
```bash
sam local invoke GetAllThermostatsFunction -e .\backend\getAllThermostat\event.json
```

Get one item
```bash
sam local invoke GetThermostatFunction -e .\backend\getThermostat\event.json
```

Add
```bash
sam local invoke AddThermostatFunction -e .\backend\addThermostat\event.json
```

## Troubleshooting 
[ERROR] Missing AWS Lambda trace data for X-Ray. Ensure Active Tracing is enabled and no subsegments are created outside the function handler.
Add "X-Amzn-Trace-Id": "Root=1-5dc86974-035ac025a456001d3ac4b6cb;Sampled=1" in headers in event.json