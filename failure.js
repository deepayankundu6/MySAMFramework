"use strict";
const awsSdk = require('aws-sdk');
const dotenv = require('dotenv').config;

module.exports.hello = async (event) => {

  try {
    dotenv();
    awsSdk.config.update({ region: 'ap-south-1' })
    const sns = awsSdk.SNS();

    console.log(process.env.topicname);

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
  } catch {
    (err) => {
      console.log("Some error occured: ", err);
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

  }
};
