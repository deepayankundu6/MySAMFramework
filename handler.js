"use strict";
const awsSdk = require('aws-sdk');

module.exports.hello = async (event) => {
  console.log("Function started at: ", new Date());
  console.log("Function Executing");

  try {
    awsSdk.config.update({ region: 'ap-south-1' })
    let current_date = new Date().toISOString();
    var params = {
      Name: "/Deep-PAR/lse-mp",
      Value: current_date,
      Overwrite: true
    }
    console.log(params)
    const ssm = new awsSdk.SSM();
    let previousSavedParam = await ssm.getParameter({ Name: "/Deep-PAR/lse-mp" }).promise();
    console.log(previousSavedParam)
    await ssm.putParameter(params).promise();
    console.log("Saved the parameter in param store")
    let savedParam = await ssm.getParameter({ Name: "/Deep-PAR/lse-mp" }).promise();
    console.log(savedParam)

    throw new Error("This is a intended failure");
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
    let sns = awsSdk.SNS();
    let snsParams = {
      TopicArn: process.env.topicArn,
      Message: `Hey your lambda has encountered an error on: ${new Date().toISOString()} please check the logs for the error details and cascade to toher if required <br>
        <b> Error details: <br>
        Error: ${err} <br>
        Occured On: ${new Date().toISOString()} <br>
        Lambda Name: ${process.env.App_Name}< br>
        Thanks & Regards <br>
        ABC app automation alert`,
      Subject: `Lambda ${process.env.App_Name} encountered an error on ${new Date().toISOString()} `
    }

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
