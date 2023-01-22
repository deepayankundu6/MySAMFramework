"use strict";
const awsSdk = require('aws-sdk');
const dotenv = require('dotenv');
dotenv.config();
awsSdk.config.update({ region: 'ap-south-1' });

module.exports.hello = async (event) => {
  console.log("Function started at: ", new Date());
  console.log("Function Executing");

  try {
    let current_date = new Date().toISOString();
    var params = {
      Name: "/Deep-PAR/lse-mp",
      Value: current_date,
      Overwrite: true
    }
    console.log("SNS topic Emamil ID: ", process.env.topicEmail)
    const ssm = new awsSdk.SSM();
    let previousSavedParam = await ssm.getParameter({ Name: "/Deep-PAR/lse-mp" }).promise();
    console.log(previousSavedParam)
    throw new Error("This is a intended failure");
    await ssm.putParameter(params).promise();
    console.log("Saved the parameter in param store")
    let savedParam = await ssm.getParameter({ Name: "/Deep-PAR/lse-mp" }).promise();
    console.log(savedParam)

    console.log("Function Executed successfully");
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Go Serverless v3.0! Your function executed successfully!",
          input: event,
        },
        null,
        2
      ),
    };
  } catch (err) {

    console.log("Some error occured during execution: ", err);
    let sns = new awsSdk.SNS();
    let ssm = new awsSdk.SSM();
    let led = await ssm.getParameter({ Name: "/Deep-PAR/lse-mp" }).promise();
    let snsParams = {
      TopicArn: process.env.topicArn,
      Message: `Hey your lambda has encountered an error on: ${new Date().toISOString()} please check the logs for the error details and cascade to to others if required.
        Error details: 
        Error: ${err}
        Occured On: ${new Date().toISOString()}
        Lambda Name: ${process.env.lambdaName}
        Last execution date and time: ${led.Parameter.Value}
        Thanks & Regards
        ABC app automation alert`,
      Subject: `Lambda ${process.env.lambdaName} encountered an error on ${new Date().toISOString()} `
    }
    console.log(led)
    await sns.publish(snsParams).promise();

    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "Some error occured while executing the lambda. Please check the cloud watch log!!!",
          input: event,
        },
        null,
        2
      ),
    }
  }
};
